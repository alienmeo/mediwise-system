import re

def levenshtein_distance(s1, s2):
    s1 = s1.lower().strip()
    s2 = s2.lower().strip()
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
        
    return previous_row[-1]

def text_normalize(text):
    """Xóa bỏ các ký tự đặc biệt, chuyển thành chữ thường để chuẩn hóa tìm kiếm"""
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s\-\(\)]', '', text)
    return text

def find_closest_ingredient(user_input, db_session):
    """
    Tìm kiếm thông minh không AI: Đối chiếu chuỗi đầu vào với Ingredient và Synonym
    Chấp nhận sai lệch chính tả nhỏ (khoảng cách Levenshtein <= 2)
    """
    from models.db_models import Ingredient, Synonym
    
    normalized_input = text_normalize(user_input)
    if not normalized_input:
        return None

    # Bước 1: Thử tìm kiếm chính xác tuyệt đối trong bảng Ingredient
    exact_ing = db_session.query(Ingredient).filter(Ingredient.name.ilike(normalized_input)).first()
    if exact_ing:
        return exact_ing

    # Bước 2: Thử tìm chính xác trong bảng Từ đồng nghĩa (Synonym)
    exact_syn = db_session.query(Synonym).filter(Synonym.name.ilike(normalized_input)).first()
    if exact_syn:
        return exact_syn.ingredient

    # Bước 3: Áp dụng thuật toán so khớp chuỗi mờ nếu không tìm thấy chính xác
    all_ingredients = db_session.query(Ingredient).all()
    best_match = None
    min_distance = 999
    
    for ing in all_ingredients:
        dist = levenshtein_distance(normalized_input, ing.name)
        if dist < min_distance and dist <= 2: # Sai lệch tối đa 2 ký tự tự động nhận diện
            min_distance = dist
            best_match = ing
            
    if best_match:
        return best_match

    # Bước 4: Kiểm tra tiếp trong từ đồng nghĩa bằng so khớp mờ
    all_synonyms = db_session.query(Synonym).all()
    for syn in all_synonyms:
        dist = levenshtein_distance(normalized_input, syn.name)
        if dist < min_distance and dist <= 2:
            min_distance = dist
            best_match = syn.ingredient
            
    return best_match