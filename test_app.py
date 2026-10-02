import json
from fastapi.testclient import TestClient
from app.main import app

def test_full_application():
    print("Testing PocketSmart AI Application Endpoints...")
    client = TestClient(app)

    # 1. Health check & Landing
    res = client.get("/")
    assert res.status_code == 200, f"Landing failed: {res.status_code}"
    print("  [✓] GET / - OK")

    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("  [✓] GET /health - OK")

    # 2. Form Pages
    for path in ["/home-planner", "/party-planner", "/jewelry-planner", "/register", "/login"]:
        res = client.get(path)
        assert res.status_code == 200, f"GET {path} failed: {res.status_code}"
        print(f"  [✓] GET {path} - OK")

    # 3. Authentication
    reg_res = client.post(
        "/register",
        data={"username": "demotester", "email": "demotester@example.com", "password": "SecurePassword123!"},
        follow_redirects=False
    )
    assert reg_res.status_code in (200, 303), f"Registration failed: {reg_res.status_code}"
    print("  [✓] POST /register - OK")

    login_res = client.post(
        "/login",
        data={"username": "demotester", "password": "SecurePassword123!"},
        follow_redirects=False
    )
    assert login_res.status_code == 303, f"Login failed: {login_res.status_code}"
    cookies = login_res.cookies
    print("  [✓] POST /login - OK")

    # 4. Protected Routes
    dash_res = client.get("/dashboard", cookies=cookies)
    assert dash_res.status_code == 200, f"Dashboard failed: {dash_res.status_code}"
    print("  [✓] GET /dashboard - OK")

    # 5. Recommendation Endpoints
    # Home Planner
    home_payload = {
        "total_budget": 60000,
        "rooms": ["Living Room", "Bedroom"],
        "items_json": json.dumps([{"name": "Sofa", "quantity": 1}, {"name": "Study Desk", "quantity": 1}]),
        "style": "Modern Minimalist"
    }
    home_res = client.post("/generate-home", data=home_payload, cookies=cookies)
    assert home_res.status_code == 200, f"Home planner failed: {home_res.status_code}"
    print("  [✓] POST /generate-home - OK")

    # Party Planner
    party_payload = {
        "total_budget": 30000,
        "guest_count": 25,
        "event_type": "Birthday",
        "venue_style": "Banquet Hall"
    }
    party_res = client.post("/generate-party", data=party_payload, cookies=cookies)
    assert party_res.status_code == 200, f"Party planner failed: {party_res.status_code}"
    print("  [✓] POST /generate-party - OK")

    # Jewelry Planner
    jewelry_payload = {
        "total_budget": 25000,
        "occasion_type": "Wedding",
        "style_preference": "Traditional Gold"
    }
    jewelry_res = client.post("/generate-jewelry", data=jewelry_payload, cookies=cookies)
    assert jewelry_res.status_code == 200, f"Jewelry planner failed: {jewelry_res.status_code}"
    print("  [✓] POST /generate-jewelry - OK")

    # 6. History and Details
    hist_res = client.get("/history", cookies=cookies)
    assert hist_res.status_code == 200, f"History failed: {hist_res.status_code}"
    print("  [✓] GET /history - OK")

    db = app.state.db
    user = db.get_user_by_username("demotester")
    if user:
        history = db.get_user_history(user["id"])
        if history:
            rec_id = history[0]["id"]
            detail_res = client.get(f"/recommendations-details/{rec_id}", cookies=cookies)
            assert detail_res.status_code == 200, f"Details page failed: {detail_res.status_code}"
            print(f"  [✓] GET /recommendations-details/{rec_id} - OK")

    print("\n🎉 ALL TESTS PASSED SUCCESSFULLY! No errors found.")

if __name__ == "__main__":
    test_full_application()
