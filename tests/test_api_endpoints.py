import requests

BASE_URL = 'http://localhost:5000'
HEADERS = {'Authorization': 'Bearer demo-token'}

def test_get_sessions():
    resp = requests.get(f'{BASE_URL}/sessions', headers=HEADERS)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

def test_get_neuron_trace():
    session = 'session_1'
    neuron = 'n1'
    resp = requests.get(f'{BASE_URL}/sessions/{session}/neurons/{neuron}?filter=zscore', headers=HEADERS)
    assert resp.status_code == 200
    data = resp.json()
    assert 'trace' in data
    assert isinstance(data['trace'], list)

if __name__ == '__main__':
    test_get_sessions()
    test_get_neuron_trace()
    print("✅ All API tests passed!")