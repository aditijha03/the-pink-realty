import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/api';
import { ArrowLeft, Plus, Hash, Home, MapPin, Bed, Bath, Car, Maximize, Image as ImageIcon, UploadCloud } from 'lucide-react';

const PREDEFINED_AMENITIES = [
  '24x7 Security', 'Power Backup', 'Lift', 
  'CCTV Camera', 'Gym', 'Children Play Area',
  'Multipurpose Hall', 'Private Pool', 'Landscaped Gardens',
  'Private Terrace', 'Modular Kitchen', 'Sea View'
];

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    listingType: 'sale',
    propertyType: 'apartment',
    constructionStatus: 'Ready to move',
    furnishing: 'Unfurnished',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    areaSqft: '',
    description: '',
    amenities: [],
    featured: false,
    isPremium: false,
    showOnWebsite: false,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      // Fetch existing logic here
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload images to Cloudinary via backend
      const uploadedImages = await Promise.all(images.map(async (img) => {
        if (!img.file) return { url: img.url }; // existing image
        
        const uploadData = new FormData();
        uploadData.append('image', img.file);
        
        const res = await apiFetch('/admin/upload', {
          method: 'POST',
          body: uploadData
        });
        
        return { url: res.data.url, publicId: res.data.publicId, isCover: false };
      }));

      // Set first image as cover
      if (uploadedImages.length > 0) {
        uploadedImages[0].isCover = true;
      }

      const payload = { 
        ...formData, 
        price: Number(formData.price) || 0,
        images: uploadedImages
      };
      
      const endpoint = isEditing ? `/admin/properties/${id}` : '/admin/properties';
      await apiFetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });

      if (!isEditing && !formData.showOnWebsite) {
        alert("Saved as draft: publish it and turn on 'Show on website' to make it visible");
      }
      navigate('/admin/properties');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Top Bar */}
      <div className="mb-6">
        <button onClick={() => navigate('/admin/properties')} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:text-gray-200 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </button>
      </div>

      {/* Main Card */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-surface p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
        
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100 dark:border-white/10">
          <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-400">
            <Plus className="w-5 h-5" />
          </div>
          <h1 className="text-4xl font-playfair font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Edit Property' : 'Add New Property'}
          </h1>
        </div>

        <div className="space-y-8">
          
          {/* Ref Number */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">
              <Hash className="w-4 h-4" /> Property Reference Number
            </label>
            <input 
              type="text" 
              value={isEditing ? formData.reference : "PR-XXX (AUTO-GENERATED)"} 
              disabled 
              className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-medium" 
            />
          </div>

          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">
              <Home className="w-4 h-4" /> Property Title
            </label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg focus:border-[#D6246E] focus:ring-1 focus:ring-[#D6246E] outline-none transition-all dark:bg-white/5 dark:text-white" 
              placeholder="e.g. Luxury 3BHK Apartment in Bandra"
              required
            />
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">Property Type</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg focus:border-[#D6246E] outline-none dark:bg-[#1a1f36] dark:text-white">
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
                <option value="plot">Plot / Land</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">Listing Type</label>
              <select name="listingType" value={formData.listingType} onChange={handleChange} className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg focus:border-[#D6246E] outline-none dark:bg-[#1a1f36] dark:text-white">
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">Construction Status</label>
              <select name="constructionStatus" value={formData.constructionStatus} onChange={handleChange} className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg focus:border-[#D6246E] outline-none dark:bg-[#1a1f36] dark:text-white">
                <option value="Ready to move">Ready to Move</option>
                <option value="Under construction">Under Construction</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">Furnishing</label>
              <select name="furnishing" value={formData.furnishing} onChange={handleChange} className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg focus:border-[#D6246E] outline-none dark:bg-[#1a1f36] dark:text-white">
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-furnished">Semi-furnished</option>
                <option value="Fully-furnished">Fully-furnished</option>
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">
                <span className="font-serif italic font-normal text-sm">₹</span> Price (₹)
              </label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg focus:border-[#D6246E] outline-none dark:bg-white/5 dark:text-white" 
                placeholder="8500000"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">
                <MapPin className="w-4 h-4" /> Location
              </label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg focus:border-[#D6246E] outline-none dark:bg-white/5 dark:text-white" 
                placeholder="Bandra West, Mumbai"
              />
            </div>
          </div>

          {/* Row 4 Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">
                <Bed className="w-4 h-4" /> Bedrooms
              </label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#D6246E]" placeholder="3" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">
                <Bath className="w-4 h-4" /> Bathrooms
              </label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#D6246E]" placeholder="2" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">
                <Car className="w-4 h-4" /> Parking
              </label>
              <input type="number" name="parking" value={formData.parking} onChange={handleChange} className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#D6246E]" placeholder="1" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">
                <Maximize className="w-4 h-4" /> Area (SQFT)
              </label>
              <input type="number" name="areaSqft" value={formData.areaSqft} onChange={handleChange} className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#D6246E]" placeholder="1450" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="5" 
              className="w-full p-3.5 border border-gray-200 dark:border-white/10 rounded-lg focus:border-[#D6246E] outline-none resize-none dark:bg-white/5 dark:text-white"
              placeholder="Describe the property — features, amenities, neighborhood..."
            ></textarea>
          </div>

          {/* Amenities Grid */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-4 uppercase">Amenities</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {PREDEFINED_AMENITIES.map(amenity => (
                <label key={amenity} className="flex items-center justify-between p-3.5 border border-gray-200 dark:border-white/10 rounded-lg cursor-pointer hover:border-[#D6246E] transition-colors">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${formData.amenities.includes(amenity) ? 'border-[#D6246E] bg-[#D6246E]' : 'border-gray-300'}`}>
                    {formData.amenities.includes(amenity) && <div className="w-1.5 h-1.5 bg-white dark:bg-surface rounded-full"></div>}
                  </div>
                  <input type="checkbox" className="hidden" checked={formData.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                </label>
              ))}
            </div>
          </div>

          {/* Flags Box */}
          <div className="bg-[#fff9fa] dark:bg-pink-500/5 border border-[#fce4eb] dark:border-pink-500/20 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 shadow-sm">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" name="showOnWebsite" checked={formData.showOnWebsite} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#fce4eb] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D6246E] group-hover:bg-gray-300 peer-checked:group-hover:bg-[#B81D5B]"></div>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Show on Website</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#fce4eb] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D6246E] group-hover:bg-gray-300 peer-checked:group-hover:bg-[#B81D5B]"></div>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Feature on Homepage</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#fce4eb] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-surface after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D6246E] group-hover:bg-gray-300 peer-checked:group-hover:bg-[#B81D5B]"></div>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Premium Project</span>
            </label>
          </div>

          {/* Images */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider mb-2 uppercase">
              <ImageIcon className="w-4 h-4" /> Property Images
            </label>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#e6c9d3] bg-[#fffcfd] rounded-xl cursor-pointer hover:bg-[#fff9fa] dark:bg-pink-500/5 transition-colors">
              <UploadCloud className="w-8 h-8 text-[#d6b4c1] mb-2" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Click or drag images here</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">First image is used as the cover photo • PNG, JPG up to 10MB each</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            
            {images.length > 0 && (
              <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                    <img src={img.url} className="w-full h-full object-cover" alt="upload" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={() => {
                setFormData({title:'',listingType:'sale',propertyType:'apartment',constructionStatus:'Ready to move',furnishing:'Unfurnished',price:'',location:'',bedrooms:'',bathrooms:'',parking:'',areaSqft:'',description:'',amenities:[],featured:false,showOnWebsite:false});
                setImages([]);
              }}
              className="px-8 py-4 rounded-lg font-bold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            >
              RESET
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-8 py-4 rounded-lg font-bold bg-[#D6246E] text-white hover:bg-pink-700 transition-colors shadow-sm disabled:opacity-70"
            >
              {loading ? 'SAVING...' : isEditing ? 'UPDATE PROPERTY' : 'ADD PROPERTY'}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
