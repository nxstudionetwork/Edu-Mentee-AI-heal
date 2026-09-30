from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import distinct

from app.database import get_db
from app.core.exceptions import NotFoundException

router = APIRouter(prefix="/api/v1/locations", tags=["Locations"])

LOCATIONS = {
    "Andhra Pradesh": {
        "districts": ["Visakhapatnam", "Guntur", "Vijayawada", "Tirupati", "Kurnool"],
        "schools": ["Zilla Parishad High School", "AP Model School", "Government Junior College", "Krishna Public School"],
    },
    "Assam": {
        "districts": ["Kamrup", "Nagaon", "Dibrugarh", "Cachar", "Jorhat"],
        "schools": ["Assam Jatiya Bidyalay", "Don Bosco School", "Pragjyotika Higher Secondary School", "Government High School"],
    },
    "Bihar": {
        "districts": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"],
        "schools": ["DAV Public School", "Patna Central School", "Nalanda Public School", "Government High School"],
    },
    "Chhattisgarh": {
        "districts": ["Raipur", "Bilaspur", "Durg", "Korba", "Rajnandgaon"],
        "schools": ["Krishna Public School", "Saraswati Shishu Mandir", "Government Higher Secondary School", "Delhi Public School"],
    },
    "Gujarat": {
        "districts": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
        "schools": ["Gujarat Public School", "Shree Swaminarayan Gurukul", "Rachana School", "Government High School"],
    },
    "Haryana": {
        "districts": ["Gurugram", "Faridabad", "Panipat", "Karnal", "Hisar"],
        "schools": ["Delhi Public School", "DAV Public School", "St. Thomas School", "Government Senior Secondary School"],
    },
    "Jharkhand": {
        "districts": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
        "schools": ["Delhi Public School", "DAV Public School", "St. Xavier's School", "Government High School"],
    },
    "Karnataka": {
        "districts": ["Bengaluru Urban", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
        "schools": ["National Public School", "Delhi Public School", "Kendriya Vidyalaya", "Government High School"],
    },
    "Kerala": {
        "districts": ["Thiruvananthapuram", "Ernakulam", "Kozhikode", "Thrissur", "Kollam"],
        "schools": ["Government Higher Secondary School", "Nirmala Higher Secondary School", "Tirurangadi High School", "Chinmaya Vidyalaya"],
    },
    "Madhya Pradesh": {
        "districts": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
        "schools": ["Delhi Public School", "St. Paul's School", "Government Higher Secondary School", "Kendriya Vidyalaya"],
    },
    "Maharashtra": {
        "districts": ["Mumbai Suburban", "Pune", "Nagpur", "Nashik", "Aurangabad"],
        "schools": ["Kendriya Vidyalaya", "St. Xavier's High School", "Saraswati Vidyalaya", "Government High School"],
    },
    "Odisha": {
        "districts": ["Khordha", "Cuttack", "Bhubaneswar", "Rourkela", "Balasore"],
        "schools": ["DAV Public School", "Government High School", "Stewart School", "Delhi Public School"],
    },
    "Punjab": {
        "districts": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
        "schools": ["Government Senior Secondary School", "DAV Public School", "Spring Dale Senior Secondary School", "Delhi Public School"],
    },
    "Rajasthan": {
        "districts": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
        "schools": ["St. Anselm's Senior Secondary School", "Delhi Public School", "Government Senior Secondary School", "Maharaja Sawai Man Singh School"],
    },
    "Tamil Nadu": {
        "districts": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
        "schools": ["Government Higher Secondary School", "Padma Seshadri Bala Bhavan", "Chettinad Vidyashram", "Sri Sankara Vidyashramam"],
    },
    "Telangana": {
        "districts": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
        "schools": ["Bhashyam Public School", "Chaitanya Public School", "Government High School", "Kendriya Vidyalaya"],
    },
    "Uttar Pradesh": {
        "districts": ["Lucknow", "Kanpur Nagar", "Varanasi", "Prayagraj", "Agra"],
        "schools": ["City Montessori School", "Delhi Public School", "Government Inter College", "St. Joseph's School"],
    },
    "Uttarakhand": {
        "districts": ["Dehradun", "Haridwar", "Nainital", "Haldwani", "Rishikesh"],
        "schools": ["Government Inter College", "Delhi Public School", "St. Joseph's Academy", "DAV Public School"],
    },
    "West Bengal": {
        "districts": ["Kolkata", "Howrah", "Hooghly", "North 24 Parganas", "Bardhaman"],
        "schools": ["Government High School", "South Point School", "Don Bosco School", "Delhi Public School"],
    },
    "Delhi": {
        "districts": ["New Delhi", "South Delhi", "East Delhi", "North West Delhi", "West Delhi"],
        "schools": ["Delhi Public School", "Springdales School", "Government Sarvodaya Vidyalaya", "Mount St. Mary's School"],
    },
}


@router.get("/states")
def get_states(db: Session = Depends(get_db)):
    """List all supported states."""
    return {"status": "success", "data": [{"name": s} for s in sorted(LOCATIONS.keys())]}


@router.get("/{state}/districts")
def get_districts(state: str):
    """List districts for a given state."""
    normalized = state.strip().lower()
    for name, info in LOCATIONS.items():
        if name.lower() == normalized:
            return {"status": "success", "data": [{"name": d} for d in info["districts"]]}
    raise NotFoundException(detail=f"State '{state}' not found")


@router.get("/{state}/{district}/schools")
def get_schools(state: str, district: str):
    """List schools for a given state + district."""
    normalized_state = state.strip().lower()
    normalized_district = district.strip().lower()
    for name, info in LOCATIONS.items():
        if name.lower() == normalized_state:
            matching = [d for d in info["districts"] if d.lower() == normalized_district]
            if matching:
                return {"status": "success", "data": [{"name": s} for s in info["schools"]]}
    raise NotFoundException(detail=f"Schools not found for {state} / {district}")
