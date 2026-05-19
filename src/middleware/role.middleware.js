export const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {
  
      try {

        console.log('User:', req.user);
  
        const userRoles = req.user.roles;
  
        const hasRole = userRoles.some(
          role => allowedRoles.includes(role)
        );
  
        if (!hasRole) {
          return res.status(403).json({
            message: 'Access denied. Insufficient permissions.'
          });
        }
  
        next();
  
      } catch (error) {
        console.error('Error in role authorization:', error);
        return res.status(500).json({
          error: error.message
        });
  
      }
  
    };
  
  };