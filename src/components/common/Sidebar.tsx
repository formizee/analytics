import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SquareTerminal,
  Loader2,
  CircleCheckIcon,
  AlertCircleIcon,
  ChevronRight,
  ChevronLeft,
  LineChart,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Logo from "/logo.svg";
import useAppStore from "@/store";
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const {
    isServerAvailable,
    version,
    isLoadingCredentials,
    isAdmin,
  } = useAppStore();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // version from vite.config.ts
  // @ts-ignore
  const ch_ui_version = __CH_UI_VERSION__;

  if (!isServerAvailable) {
    return null;
  }

  const navItems = [
    { to: "/", label: "Home", icon: SquareTerminal, isNewWindow: false },
    { to: "/metrics", label: "Metrics", icon: LineChart, isNewWindow: false },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`flex flex-col h-screen bg-background border-r transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="p-2 ml-2 mt-2 flex items-center justify-between w-full">
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="h-8 w-8" />
          {isExpanded && (
            <span className="font-bold text-lg truncate">Analytics.</span>
          )}
        </Link>
        {isExpanded && (
          <Button
            variant="link"
            size="icon"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-grow">
        <nav className="space-y-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              target={item.isNewWindow ? "_blank" : "_self"}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/80"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isExpanded ? "mr-2" : ""}`} />
              {isExpanded && <span>{item.label}</span>}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`relative flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/admin"
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/80"
              }`}
            >
              <div className="relative">
                <ShieldCheck
                  className={`h-5 w-5 ${isExpanded ? "mr-2" : ""}`}
                />
                <Badge
                  variant="secondary"
                  className={`absolute -top-1 -right-0 bg-purple-500 text-[10px] text-white hover:bg-purple-600 p-1
                    ${isExpanded ? "mr-2" : ""}
                    `}
                >
                  {" "}
                </Badge>
              </div>
              {isExpanded && <span>Admin</span>}
            </Link>
          )}
        </nav>
      </ScrollArea>

      <div className="w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={`${
                isExpanded
                  ? "w-full justify-items-stretch mb-2"
                  : "m-auto w-full"
              } hover:bg-transparent bg-transparent text-primary`}
            >
              {isLoadingCredentials ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isServerAvailable ? (
                <CircleCheckIcon className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircleIcon className="h-5 w-5 text-red-500" />
              )}
              {isExpanded && (
                <span className="ml-2">
                  {isLoadingCredentials
                    ? "Connecting..."
                    : isServerAvailable
                    ? "Connected"
                    : "Disconnected"}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="space-y-1">
              <p className="text-sm font-medium">Server Status</p>
              <p className="text-xs">
                {isLoadingCredentials
                  ? "Connecting..."
                  : isServerAvailable
                  ? "Connected"
                  : "Disconnected"}
              </p>
              <p className="text-xs">Click House Version: {version}</p>
              <p className="text-xs">UI Version: {ch_ui_version}</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {!isExpanded && (
        <Button
          variant="ghost"
          size="icon"
          className="m-2"
          onClick={() => setIsExpanded(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
