from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, Column, Integer, String, Text, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
import os, uuid, json

# ==============================
# Setup
# ==============================
BASE_DIR = os.path.dirname(__file__)
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

DATABASE_URL = "sqlite:///" + os.path.join(BASE_DIR, "app.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ==============================
# Database Models
# ==============================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    profile_photo = Column(String, nullable=True)
    token = Column(String, nullable=True)


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    state = Column(String, index=True)
    description = Column(Text)
    photos = Column(Text)  # JSON list of filenames


Base.metadata.create_all(bind=engine)

# ==============================
# App Setup
# ==============================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# Dependency
# ==============================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==============================
# Helpers
# ==============================
def get_user_by_token(token: str, db):
    if not token:
        return None
    return db.query(User).filter(User.token == token).first()

# ==============================
# Auth Routes
# ==============================
@app.post("/signup")
async def signup(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    file: UploadFile = File(None),
    db=Depends(get_db)
):
    username = username.strip()

    if db.query(User).filter(or_(User.username == username, User.email == email)).first():
        raise HTTPException(status_code=400, detail="Username or email already exists")

    if len(password) < 4:
        raise HTTPException(status_code=400, detail="Password too short (min 4 chars)")
    if len(password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Password too long (max 72 chars)")

    user = User(username=username, email=email, password_hash=pwd_context.hash(password))

    # Save profile photo
    if file:
        contents = await file.read()
        if len(contents) > 2 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Profile photo must be 0–2MB")
        fname = f"{uuid.uuid4().hex}_{file.filename}"
        path = os.path.join(UPLOAD_DIR, fname)
        with open(path, "wb") as f:
            f.write(contents)
        user.profile_photo = fname

    user.token = uuid.uuid4().hex
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "username": user.username,
        "token": user.token,
        "profile_photo": user.profile_photo,
    }


@app.post("/login")
def login(username: str = Form(...), password: str = Form(...), db=Depends(get_db)):
    user = db.query(User).filter(or_(User.username == username, User.email == username)).first()

    if not user or not pwd_context.verify(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    user.token = uuid.uuid4().hex
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "username": user.username,
        "token": user.token,
        "profile_photo": user.profile_photo,
    }

# ==============================
# Places CRUD
# ==============================
@app.post("/places")
async def create_place(
    name: str = Form(...),
    state: str = Form(...),
    description: str = Form(...),
    files: list[UploadFile] = File([]),
    token: str = Form(None),
    db=Depends(get_db)
):
    user = get_user_by_token(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    saved = []
    for file in files:
        contents = await file.read()
        if len(contents) > 2 * 1024 * 1024:
            raise HTTPException(status_code=400, detail=f"File too large: {file.filename}")
        fname = f"{uuid.uuid4().hex}_{file.filename}"
        path = os.path.join(UPLOAD_DIR, fname)
        with open(path, "wb") as f:
            f.write(contents)
        saved.append(fname)

    place = Place(name=name, state=state, description=description, photos=str(saved))
    db.add(place)
    db.commit()
    db.refresh(place)

    return {
        "id": place.id,
        "name": place.name,
        "state": place.state,
        "photos": saved,
    }


@app.get("/places")
def list_places(state: str = None, db=Depends(get_db)):
    q = db.query(Place)
    if state:
        q = q.filter(Place.state == state)

    places = q.all()
    result = []

    for p in places:
        try:
            photos = eval(p.photos)
        except Exception:
            photos = []
        result.append({
            "id": p.id,
            "name": p.name,
            "state": p.state,
            "description": p.description,
            "photos": photos
        })
    return result


@app.get("/places/{place_id}")
def get_place(place_id: int, db=Depends(get_db)):
    p = db.query(Place).get(place_id)
    if not p:
        raise HTTPException(status_code=404, detail="Not found")

    try:
        photos = eval(p.photos)
    except Exception:
        photos = []

    return {
        "id": p.id,
        "name": p.name,
        "state": p.state,
        "description": p.description,
        "photos": photos,
    }


@app.put("/places/{place_id}")
async def update_place(
    place_id: int,
    name: str = Form(None),
    state: str = Form(None),
    description: str = Form(None),
    files: list[UploadFile] = File([]),
    token: str = Form(None),
    db=Depends(get_db)
):
    user = get_user_by_token(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    p = db.query(Place).get(place_id)
    if not p:
        raise HTTPException(status_code=404, detail="Not found")

    if name:
        p.name = name
    if state:
        p.state = state
    if description:
        p.description = description

    photos = []
    if files:
        for file in files:
            contents = await file.read()
            if len(contents) > 2 * 1024 * 1024:
                raise HTTPException(status_code=400, detail=f"File too large: {file.filename}")
            fname = f"{uuid.uuid4().hex}_{file.filename}"
            path = os.path.join(UPLOAD_DIR, fname)
            with open(path, "wb") as f:
                f.write(contents)
            photos.append(fname)
        p.photos = str(photos)

    db.add(p)
    db.commit()
    db.refresh(p)

    try:
        photos = eval(p.photos)
    except Exception:
        photos = []

    return {
        "id": p.id,
        "name": p.name,
        "state": p.state,
        "photos": photos,
    }


@app.delete("/places/{place_id}")
def delete_place(place_id: int, token: str = Form(None), db=Depends(get_db)):
    user = get_user_by_token(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    p = db.query(Place).get(place_id)
    if not p:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(p)
    db.commit()
    return {"detail": "Deleted"}

# ==============================
# Serve Uploaded Files
# ==============================
@app.get("/uploads/{filename}")
def uploaded_file(filename: str):
    path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404)
    return FileResponse(path)
