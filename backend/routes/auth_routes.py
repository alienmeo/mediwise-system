from flask import Blueprint, jsonify, request
from controllers.auth_controller import register_user, login_user

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
    return register_user()

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    return login_user()