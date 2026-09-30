from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.dependencies import get_current_user, get_current_teacher
from app.core.exceptions import NotFoundException, ForbiddenException
from app.models import User, VirtualLab, Experiment, Subject
from app.schemas import VirtualLabResponse, ExperimentResponse, ExperimentCreate
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/labs", tags=["Virtual Labs"])


@router.get("/")
def list_labs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    subject_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List virtual labs with optional subject filter."""
    query = db.query(VirtualLab).filter(VirtualLab.is_active == True)

    if subject_id:
        query = query.filter(VirtualLab.subject_id == subject_id)

    total = query.count()
    labs = query.order_by(VirtualLab.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Virtual labs retrieved successfully",
        "data": [
            {
                "id": lab.id,
                "uid": lab.uid,
                "subject_id": lab.subject_id,
                "title": lab.title,
                "description": lab.description,
                "icon": lab.icon,
                "is_active": lab.is_active,
                "created_at": lab.created_at.isoformat() if lab.created_at else None,
            }
            for lab in labs
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{lab_id}")
def get_lab(
    lab_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get lab with experiments."""
    lab = db.query(VirtualLab).filter(VirtualLab.id == lab_id, VirtualLab.is_active == True).first()
    if not lab:
        raise NotFoundException(detail="Virtual lab not found")

    experiments = db.query(Experiment).filter(
        Experiment.lab_id == lab.id,
        Experiment.is_active == True,
    ).all()

    return {
        "status": "success",
        "message": "Virtual lab retrieved successfully",
        "data": {
            "id": lab.id,
            "uid": lab.uid,
            "subject_id": lab.subject_id,
            "title": lab.title,
            "description": lab.description,
            "icon": lab.icon,
            "experiments": [
                {
                    "id": exp.id,
                    "uid": exp.uid,
                    "title": exp.title,
                    "description": exp.description,
                    "difficulty": exp.difficulty,
                    "duration_minutes": exp.duration_minutes,
                    "simulation_url": exp.simulation_url,
                }
                for exp in experiments
            ],
        },
    }


@router.get("/experiments/{experiment_id}")
def get_experiment(
    experiment_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get experiment detail."""
    experiment = db.query(Experiment).filter(
        Experiment.id == experiment_id,
        Experiment.is_active == True,
    ).first()
    if not experiment:
        raise NotFoundException(detail="Experiment not found")

    return {
        "status": "success",
        "message": "Experiment retrieved successfully",
        "data": {
            "id": experiment.id,
            "uid": experiment.uid,
            "lab_id": experiment.lab_id,
            "title": experiment.title,
            "description": experiment.description,
            "instructions": experiment.instructions,
            "diagram_url": experiment.diagram_url,
            "simulation_url": experiment.simulation_url,
            "difficulty": experiment.difficulty,
            "duration_minutes": experiment.duration_minutes,
            "created_at": experiment.created_at.isoformat() if experiment.created_at else None,
        },
    }


@router.post("/{lab_id}/experiments")
def create_experiment(
    lab_id: int = Path(...),
    data: ExperimentCreate = Body(...),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Create an experiment in a lab (teacher only)."""
    lab = db.query(VirtualLab).filter(VirtualLab.id == lab_id, VirtualLab.is_active == True).first()
    if not lab:
        raise NotFoundException(detail="Virtual lab not found")

    experiment = Experiment(
        uid=generate_id("EXPT"),
        lab_id=lab_id,
        title=data.title,
        description=data.description,
        instructions=data.instructions,
        diagram_url=data.diagram_url,
        simulation_url=data.simulation_url,
        difficulty=data.difficulty,
        duration_minutes=data.duration_minutes,
        is_active=True,
    )
    db.add(experiment)
    db.commit()
    db.refresh(experiment)

    return {
        "status": "success",
        "message": "Experiment created successfully",
        "data": {
            "id": experiment.id,
            "uid": experiment.uid,
            "lab_id": experiment.lab_id,
            "title": experiment.title,
            "description": experiment.description,
            "instructions": experiment.instructions,
            "simulation_url": experiment.simulation_url,
            "difficulty": experiment.difficulty,
            "duration_minutes": experiment.duration_minutes,
        },
    }
