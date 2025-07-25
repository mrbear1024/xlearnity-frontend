import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/hooks/useLanguage";
import { GoogleLogin } from "@react-oauth/google";
import { apiService } from "@/services/api";
import { useApp } from "@/contexts/AppContext";
import { json } from "stream/consumers";
interface AppHeaderProps {
  className?: string;
}

const AppHeader = ({ className }: AppHeaderProps) => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { state, setUser, logout } = useApp();

  return (
    <header className={`p-6 border-b border-border ${className}`}>
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center gap-4">
          {/* <Button 
            variant="outline" 
            className="border-youlearn-primary text-youlearn-primary hover:bg-youlearn-primary hover:text-youlearn-primary-foreground"
          >
            {t('header.upgrade')}
          </Button> */}
         
          {state.user && (state.user.username || state.user.name || state.user.email) ? (
            <>
              <span>
                {state.user.username || state.user.name || state.user.email}
              </span>
              <Button variant="outline" onClick={logout}>
                {t('header.logout') || 'Logout'}
              </Button>
            </>
          ) : (
            <GoogleLogin
              onSuccess={async credentialResponse => {
                // 调用后端接口获了idtoken
                console.log("credentialResponse: " + credentialResponse);
                const idToken = credentialResponse.credential;
                const data = await apiService.googleLogin(idToken);
                console.log("data: " + data);
                console.log("login success");
                console.log(JSON.stringify(data));
                setUser(data); // 保存用户信息                
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted">
                <span className="text-lg">{currentLanguage === 'zh' ? '🇨🇳' : '🇺🇸'}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-1 z-50 bg-background border border-border shadow-lg" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm h-8 ${currentLanguage === 'zh' ? 'bg-muted' : ''}`}
                  onClick={() => changeLanguage('zh')}
                >
                  <span className="mr-2">🇨🇳</span>
                  {t('header.chinese')}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm h-8 ${currentLanguage === 'en' ? 'bg-muted' : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  <span className="mr-2">🇺🇸</span>
                  {t('header.english')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">⌘K</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader; 