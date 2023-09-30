from django.conf import settings
from PIL import Image
from deepdanbooru_onnx import DeepDanbooru,process_image
from pathlib import Path

model = None
def load_model():
    global model
    print("Loading deepdanbooru model")
    try:
        model = DeepDanbooru(threshold=0.6)
    except:
        print("Failed to download deepdanbooru model, reading local model & tags")

        root_dir = Path(settings.BASE_DIR)
        dd_dir = root_dir / 'deepdanbooru'
        model_path = dd_dir / 'deepdanbooru.onnx'
        tags_path = dd_dir / 'tags.txt'
        model = DeepDanbooru(
        threshold=0.6,
        model_path=str(model_path.resolve()),
        tags_path=str(tags_path.resolve()))
    print("Successfully loaded deepdanbooru model")
def suggestTags(img:Image):
    global model
    tags = []
    if not model:
        try:
            load_model()
        except:
            return tags
    tags_dict = model(process_image(img))
    tags = list(tags_dict.keys())
    return tags
