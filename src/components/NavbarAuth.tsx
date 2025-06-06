
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Settings, Upload, Heart } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const NavbarAuth = () => {
  const { user, isAuthenticated, logout } = useAuth();

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const displayName = user?.user_metadata?.name || user?.email || "User";
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getDisplayName = () => {
    return user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login" className="text-gray-700 hover:text-electric-blue px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Login
        </Link>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button asChild className="bg-gradient-to-r from-electric-blue to-electric-orange text-white hover:from-electric-blue/90 hover:to-electric-orange/90">
            <Link to="/login" state={{ isSignUp: true }}>
              Sign Up
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-10 w-10 cursor-pointer border-2 border-electric-blue/20 hover:border-electric-blue/50 transition-all">
          {user?.user_metadata?.avatar_url && <AvatarImage src={user.user_metadata.avatar_url} />}
          <AvatarFallback className="bg-gradient-to-r from-electric-blue to-electric-orange text-white">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
        <DropdownMenuLabel className="font-serif">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{getDisplayName()}</span>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarAuth;
