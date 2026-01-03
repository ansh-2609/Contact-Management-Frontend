
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { getContact } from './services/appServices';
import { useDispatch} from 'react-redux'; 
import { setLoading, setRefreshing, addContact } from './store/contactList';
import { useEffect, useState } from 'react';

function App() {

    const dispatch = useDispatch();

    const fetchContacts = async () => {
    try {
        dispatch(setRefreshing(true));
        const data = await getContact();
        dispatch(addContact(data));
    } catch (error) {
        console.error('Error fetching contacts:', error);
    } finally {
        dispatch(setLoading(false));
        dispatch(setRefreshing(false));
    }
    };

    useEffect(() => {
      fetchContacts();
    }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30">
      <Header />
      <Home />
      <Footer/>
    </div>
  );
}

export default App;