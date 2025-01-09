

const MemberAvatar = ({ member, size = "default" }) => {
    const sizeClasses = {
      small: "h-8 w-8 text-sm",
      default: "h-10 w-10 text-base",
      large: "h-16 w-16 text-xl"
    };
  
    const getInitials = (name) => {
      return name.split(' ').map(n => n[0]).join('');
    };
  
    return (
      <div className={`relative rounded-full flex items-center justify-center ${sizeClasses[size]} ${
        member.profilePicture ? 'bg-transparent' : 'bg-green-100'
      }`}>
        {member.profilePicture ? (
          <img
            src={member.profilePicture}
            alt={member.name}
            className={`rounded-full object-cover ${sizeClasses[size]}`}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <span className="text-green-600 font-medium">
            {getInitials(member.name)}
          </span>
        )}
        
        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
          member.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'
        }`} />
      </div>
    );
  };

  export default MemberAvatar;