# def test_message_flow(client, test_users):
#     # Login as user1
#     client.post('/login', json={'email': 'test1@example.com', 'password': 'pass123'})
    
#     # Send message
#     response = client.post('/api/messages', json={
#         'message_from': 1,
#         'message_to': 2,
#         'content': 'Test message'
#     })
#     assert response.status_code == 201
    
#     # Verify retrieval
#     response = client.get('/api/messages?user_id=2&contact_id=1')
#     assert b'Test message' in response.data