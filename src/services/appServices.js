
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getContact = async () => {
    try{
        const response = await fetch(`${API_URL}/api/contacts`,
            {
                method: 'GET',
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw error;
    }
}

export const createContact = async (contact) => {
    try{
        const response = await fetch(`${API_URL}/api/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact),
        });
        return response;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
}

export const deleteContact = async (contactId) => {
    try{
        const response = await fetch(`${API_URL}/api/contacts/${contactId}`, {
            method: 'DELETE',
        });
        return response;
    } catch (error) {
        console.error('Error deleting contact:', error);
        throw error;
    }
}