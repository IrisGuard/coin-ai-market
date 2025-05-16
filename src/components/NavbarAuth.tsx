
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
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login" className="text-gray-700 hover:text-coin-purple px-3 py-2 rounded-md text-sm font-medium">
          Login
        </Link>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button asChild className="bg-gradient-to-r from-coin-purple to-coin-skyblue text-white">
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
        <Avatar className="h-10 w-10 cursor-pointer border-2 border-coin-purple/20 hover:border-coin-purple/50 transition-all">
          {user?.avatar_url && <AvatarImage src={user.avatar_url} />}
          <AvatarFallback className="bg-gradient-to-r from-coin-purple to-coin-skyblue text-white">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glassmorphism">
        <DropdownMenuLabel className="font-serif">
          <div className="flex flex-col">
            <span className="font-medium">{user.name || 'User'}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full cursor-pointer">
            <User className="mr-2 h-4 w-4 text-coin-purple" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/upload" className="w-full cursor-pointer">
            <Upload className="mr-2 h-4 w-4 text-coin-purple" />
            <span>Upload Coin</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/favorites" className="w-full cursor-pointer">
            <Heart className="mr-2 h-4 w-4 text-coin-purple" />
            <span>Favorites</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="w-full cursor-pointer">
            <Settings className="mr-2 h-4 w-4 text-coin-purple" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarAuth;
