import PropTypes from 'prop-types';

const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md ${className}`}
      {...props}
    >
      <div className="invisible">&#8203;</div>
    </div>
  );
};

export const SkeletonCircle = ({ className = '', ...props }) => {
  return (
    <Skeleton
      className={`rounded-full ${className}`}
      {...props}
    />
  );
};

SkeletonCircle.propTypes = {
  className: PropTypes.string,
};

export const SkeletonText = ({ lines = 1, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-4/5' : 'w-full'} ${className}`}
          {...props}
        />
      ))}
    </div>
  );
};

SkeletonText.propTypes = {
  lines: PropTypes.number,
  className: PropTypes.string,
};

Skeleton.propTypes = {
  className: PropTypes.string,
};

export default Skeleton;