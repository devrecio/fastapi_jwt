import requests

BASE_URL = "http://127.0.0.1:8000/auth"

# -----------------------
# 1. Registro de usuario
# -----------------------
register_data = {
    "email": "test@example.com",
    "password": "123456"
}

print("Registrando usuario...")
response = requests.post(f"{BASE_URL}/register", json=register_data)
print("Status code:", response.status_code)
print("Response:", response.json())
print("\n")

# -----------------------
# 2. Login
# -----------------------
login_data = {
    "username": "test@example.com",
    "password": "123456"
}

print("Iniciando sesión...")
response = requests.post(f"{BASE_URL}/login", data=login_data)
print("Status code:", response.status_code)

if response.status_code == 200:
    token_data = response.json()
    print("Token recibido:", token_data)
    access_token = token_data["access_token"]
else:
    print("Error al hacer login:", response.json())
    exit()

print("\n")

# -----------------------
# 3. Obtener usuario actual (/me)
# -----------------------
headers = {"Authorization": f"Bearer {access_token}"}
print("Llamando a /me con el token...")
response = requests.get(f"{BASE_URL}/me", headers=headers)
print("Status code:", response.status_code)
print("Response:", response.json())
