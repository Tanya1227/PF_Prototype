from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/get-field-coordinates', methods=['POST'])
def get_field_coordinates():
    data = request.json
    field_names = data.get('fieldNames')
    
    # Dummy coordinates returned for each field
    result = []
    if "Location" in field_names:
        result.append({
            "serialNo": "1",
            "id": "14",
            "entityValue": "US-001",
            "entityName": "Location",
            "pixelCoord": [[652.0, 211.0], [695.0, 211.0], [695.0, 227.0], [652.0, 227.0]]
        })
    if "Name" in field_names:
        result.append({
            "serialNo": "2",
            "id": "15",
            "entityValue": "John",
            "entityName": "Name",
            "pixelCoord": [[55.0, 235.0], [83.0, 235.0], [83.0, 249.0], [55.0, 249.0]]
        })
    if "Date" in field_names:
        result.append({
            "serialNo": "3",
            "id": "33",
            "entityValue": "2312/2019",
            "entityName": "Date",
            "pixelCoord": [[637.0, 265.0], [695.0, 265.0], [695.0, 277.0], [637.0, 277.0]]
        })
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
