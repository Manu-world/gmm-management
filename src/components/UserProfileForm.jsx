import MemberAvatar from "./MemberAvatar";
const regions = ['All Regions', 'Greater Accra', 'Ashanti', 'Northern', 'Volta', 'Eastern', 'Western'];

const UserProfileForm = ({ user, onClose }) => (

    
    <div className="space-y-6">
      <div className="flex justify-center">
        <MemberAvatar member={user} size="large" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            defaultValue={user.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            defaultValue={user.email}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            defaultValue={user.phone}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Region</label>
          <select
            defaultValue={user.region}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {regions.filter(r => r !== 'All Regions').map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Occupation</label>
          <input
            type="text"
            defaultValue={user.occupation}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  export default UserProfileForm;