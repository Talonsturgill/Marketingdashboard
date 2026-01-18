import json

try:
    with open('n8n_response.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
except UnicodeDecodeError:
    with open('n8n_response.json', 'r', encoding='utf-16') as f:
        data = json.load(f)

if isinstance(data, list):
    print(f"Root is list of length {len(data)}")
    if len(data) > 0:
        print("First item keys:", data[0].keys())
        print("Sample item:", json.dumps(data[0], indent=2))
else:
    print("Root is dict")
    print("Keys:", data.keys())
