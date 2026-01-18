import json
import chardet

def inspect_json():
    print("Reading file to detect encoding...")
    raw_data = open('n8n_response.json', 'rb').read()
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    print(f"Detected encoding: {encoding}")

    try:
        content = raw_data.decode(encoding)
        data = json.loads(content)
        
        print(f"Data type: {type(data)}")
        
        sample = None
        if isinstance(data, list):
            print(f"List length: {len(data)}")
            if len(data) > 0:
                sample = data[0]
        elif isinstance(data, dict):
            print(f"Dict keys: {list(data.keys())}")
            # If it's a wrapper like { results: [...] }
            if 'results' in data:
                print("Found 'results' key")
                if len(data['results']) > 0:
                    sample = data['results'][0]
            else:
                sample = data
        
        if sample:
            print("\n--- SAMPLE ITEM STRUCTURE ---")
            print(json.dumps(sample, indent=2))
            
            # Specific check for Platform
            print("\n--- PLATFORM CHECK ---")
            # Try various paths
            paths = [
                "item.get('platform')",
                "item.get('Platform')",
                "item.get('properties', {}).get('Platform')",
                "item.get('properties', {}).get('Platform', {}).get('select', {}).get('name')"
            ]
            
            item = sample
            for p in paths:
                try:
                    val = eval(p)
                    print(f"{p}: {val}")
                except Exception as e:
                    print(f"{p}: Error {e}")

    except Exception as e:
        print(f"Error parsing JSON: {e}")

if __name__ == "__main__":
    try:
        # Install chardet if missing (unlikely in standard envs but fallback)
        import chardet
        inspect_json()
    except ImportError:
        # Fallback if chardet not available, try utf-16 then utf-8
        print("chardet not found, trying manual encodings")
        try:
            with open('n8n_response.json', 'r', encoding='utf-16') as f:
                print("Reading as utf-16")
                # ... reusing logic would be better but keeping it simple for tool
                data = json.load(f)
                print(json.dumps(data[0] if isinstance(data, list) else data, indent=2))
        except Exception as e:
            print(f"UTF-16 failed: {e}")
            try:
                with open('n8n_response.json', 'r', encoding='utf-8') as f:
                    print("Reading as utf-8")
                    data = json.load(f)
                    print(json.dumps(data[0] if isinstance(data, list) else data, indent=2))
            except Exception as e2:
                print(f"UTF-8 failed: {e2}")
