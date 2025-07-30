import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Settings, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { NAV_ITEMS } from "../constants/index";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useAuth } from "@/lib/authContext.jsx";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from "@radix-ui/react-popover";
import { logoutUser, fetchUser } from "@/ConfigAPI";

export default function Header({ startShow }) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [user, setUser] = useState({});
    const { isLoggedIn, isLoading, setLoginStatus } = useAuth();
    
    // Show nothing while auth state is loading
    if (isLoading) {
        return null;
    }

    useEffect(() => {
        handleProfile()
        console.log('Is logged in: ', isLoggedIn);
        
    }, [isLoggedIn])

    const handleManageAccount = () => {}
    const handleLogout = async() => {
        const response = await logoutUser()
        if(response){
            setUser({})
            setLoginStatus(false)
            console.log("User logged out successfully");
        }else{
            console.log("User logout failed");
        }
    }

    const handleProfile = async() => {
        const response = await fetchUser()
        console.log("User in handleProfile: ", response);
        if(response){
            setUser(response.data.user)
        }
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/90 border-b border-zinc-800/50 shadow-2xl shadow-zinc-900/20">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/50 via-zinc-950/80 to-zinc-900/50 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-18">
                    {/* Logo Section */}
                    <Link to="/">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                            className="flex items-center gap-3"
                        >
                            <motion.div
                                whileHover={{
                                    rotate: 15,
                                    scale: 1.1,
                                    filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
                                }}
                                className="relative"
                            >
                                <div className="size-8 sm:size-9 text-blue-400 relative z-10">
                                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </div>
                                {/* Glow effect */}
                                <div className="absolute inset-0 size-8 sm:size-9 bg-blue-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>

                            <div className="flex flex-col">
                                <motion.h1
                                    whileHover={{ scale: 1.02 }}
                                    className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent"
                                >
                                    InsightBoard
                                </motion.h1>
                                <div className="h-[1px] w-0 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-500" />
                            </div>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {NAV_ITEMS.map((item, index) => (
                            <Link to={item.path} key={item.label}>
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{
                                        y: -2,
                                        color: "#ffffff",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative text-zinc-300 hover:text-white text-sm font-medium transition-all duration-300 group px-3 py-2 rounded-lg hover:bg-zinc-800/30"
                                >
                                    {item.label}
                                    <motion.span
                                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-3/4 rounded-full"
                                        whileHover={{ width: "75%" }}
                                    />
                                </motion.div>
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        {/* Notification Bell - Only show when logged in */}
                        {isLoggedIn && (
                            <motion.div
                                whileHover={{
                                    rotate: [0, -10, 10, -10, 0],
                                    scale: 1.1,
                                }}
                                whileTap={{ scale: 0.9 }}
                                className="relative group"
                            >
                                <div className="text-zinc-400 hover:text-white cursor-pointer p-2.5 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 border border-transparent hover:border-zinc-700/50">
                                    <Bell size={18} className="stroke-current" />
                                    {/* Notification dot */}
                                    <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                </div>
                            </motion.div>
                        )}

                        {/* Settings - Only show when logged in */}
                        {isLoggedIn && (
                            <motion.div
                                whileHover={{
                                    rotate: 90,
                                    scale: 1.1,
                                }}
                                whileTap={{ scale: 0.9 }}
                                className="text-zinc-400 hover:text-white cursor-pointer p-2.5 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 border border-transparent hover:border-zinc-700/50"
                            >
                                <Settings size={18} className="stroke-current" />
                            </motion.div>
                        )}

                        {/* Get Started Button */}
                        {startShow && (
                            <Link to={isLoggedIn ? "/main" : "#"}>
                                <motion.button
                                    onClick={() => !user}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="hidden sm:flex items-center justify-center h-10 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-400/30"
                                >
                                    Get Started
                                    <motion.span
                                        className="ml-2 text-blue-200"
                                        animate={{ x: [0, 3, 0] }}
                                        transition={{
                                            repeat: Number.POSITIVE_INFINITY,
                                            duration: 2,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        →
                                    </motion.span>
                                </motion.button>
                            </Link>
                        )}

                        {/* Auth Buttons */}
                        {isLoggedIn ? (
                            <div className="relative inline-block text-left">
                                {/* Radix UI Avatar wrapped in Popover */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div className="cursor-pointer">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage
                                                    className="rounded-full"
                                                    src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                                                    alt="User Avatar"
                                                />
                                                <AvatarFallback>A</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </PopoverTrigger>

                                    <PopoverContent 
                                        className="bg-zinc-900/95 backdrop-blur-lg text-white rounded-xl shadow-2xl shadow-zinc-900/50 border border-zinc-700/50 w-60 p-3 z-[100] overflow-hidden"
                                        sideOffset={10}
                                        align="end"
                                    >
                                        {/* Glowing border effect */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50 mb-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="font-semibold text-white">{user.name?.charAt(0)}</span>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-medium text-white truncate">{user.name}</p>
                                                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <button
                                                    onClick={handleManageAccount}
                                                    className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-zinc-200 hover:bg-zinc-800/60 hover:text-white transition-all duration-200 hover:translate-x-1 flex items-center group"
                                                >
                                                    <span className="group-hover:text-blue-400 transition-colors">
                                                        <Settings size={16} className="mr-2 inline" />
                                                    </span>
                                                    Manage Account
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-rose-100 hover:bg-rose-900/40 hover:text-white transition-all duration-200 hover:translate-x-1 flex items-center group"
                                                >
                                                    <span className="group-hover:text-rose-400 transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                            <polyline points="16 17 21 12 16 7"></polyline>
                                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                                        </svg>
                                                    </span>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                        <PopoverArrow className="fill-gray-800" />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        ) : (
                        <Link to="/login">
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="hidden sm:flex items-center justify-center h-10 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-400/30 cursor-pointer"
                            >
                                Login
                            </motion.button>
                        </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800/50 transition-all duration-300"
                        >
                            <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.div>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: isMenuOpen ? 1 : 0,
                        height: isMenuOpen ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="lg:hidden overflow-hidden border-t border-zinc-800/50 mt-2"
                >
                    <div className="py-4 space-y-2">
                        {NAV_ITEMS.map((item, index) => (
                            <Link to={item.path} key={item.label}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{
                                        opacity: isMenuOpen ? 1 : 0,
                                        x: isMenuOpen ? 0 : -20,
                                    }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="block px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/30 rounded-lg transition-all duration-300"
                                >
                                    {item.label}
                                </motion.div>
                            </Link>
                        ))}
                        {isLoggedIn ? (
                            <div className="w-full mt-4 flex justify-center">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage
                                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                                        alt="User Avatar"
                                    />
                                    {/* Fallback is optional; in case the image doesn't load */}
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                            </div>
                        ) : (
                            <motion.button
                                onClick={() => openSignIn()}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: isMenuOpen ? 1 : 0,
                                    x: isMenuOpen ? 0 : -20,
                                }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className="w-full mt-4 flex items-center justify-center h-10 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-semibold"
                            >
                                Login
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </div>
        </header>
    );
}