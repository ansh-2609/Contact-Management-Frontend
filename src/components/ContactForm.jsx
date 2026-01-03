import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { createContact } from '../services/appServices';
import { useDispatch } from 'react-redux';
import { addContact } from '../store/contactList';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(emailRegex)) {
      newErrors.email = 'Valid email is required';
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.match(phoneRegex)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await createContact(formData);

      if (response.ok) {
        const newContact = await response.json();
        setSuccessMsg('Contact added successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
        // onContactAdded(newContact);
        dispatch(addContact(newContact));

        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name.trim() &&
    formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
    formData.phone.match(/^\d{10}$/);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="px-8 py-6 bg-linear-to-r from-blue-600 to-indigo-600">
          <h2 className="text-2xl font-bold text-white">Add New Contact</h2>
          <p className="text-blue-100 mt-1">Fill in the details below to add a new contact</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8">
          {/* Success Message */}
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-emerald-700 font-medium">{successMsg}</p>
                <p className="text-emerald-600 text-sm mt-1">Contact has been saved successfully.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="text-red-700 font-medium">Submission Error</p>
                <p className="text-red-600 text-sm mt-1">{errors.submit}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="John Doe"
                />
                {formData.name && !errors.name && (
                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-emerald-500" />
                )}
              </div>
              {errors.name && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="john@example.com"
                />
                {formData.email && !errors.email && (
                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-emerald-500" />
                )}
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                    errors.phone
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="1234567890"
                />
                {formData.phone && !errors.phone && (
                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-emerald-500" />
                )}
              </div>
              {errors.phone && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Message <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2 transition-all duration-200"
                placeholder="Add any additional notes or information about this contact..."
                rows="4"
              ></textarea>
              <p className="text-gray-500 text-sm">
                {formData.message.length}/500 characters
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${
                isFormValid
                  ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Adding Contact...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Add Contact</span>
                </>
              )}
            </button>
            
            {/* Form Status Indicator */}
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${formData.name ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                <div className={`w-2 h-2 rounded-full ${formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                <div className={`w-2 h-2 rounded-full ${formData.phone.match(/^\d{10}$/) ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-500 ml-2">
                  {isFormValid ? 'All fields valid ✓' : 'Complete all required fields'}
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>


    </div>
  );
}