from flask import Blueprint
from controllers.admin_controller import (
    get_admin_stats, manage_feedbacks, create_drug_by_admin, 
    export_database_json, import_database_json
)
from controllers.auth_controller import token_required, admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
@token_required
@admin_required
def stats(current_user):
    return get_admin_stats()

@admin_bp.route('/feedbacks', methods=['GET'])
@token_required
@admin_required
def feeds(current_user):
    return manage_feedbacks()

@admin_bp.route('/drugs/create', methods=['POST'])
@token_required
@admin_required
def make_drug(current_user):
    return create_drug_by_admin()

@admin_bp.route('/export', methods=['GET'])
@token_required
@admin_required
def exp_db(current_user):
    return export_database_json()

@admin_bp.route('/import', methods=['POST'])
@token_required
@admin_required
def imp_db(current_user):
    return import_database_json()