import { Outlet } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';

export const MainLayout = () => {
  return (
    <div className="main">
      <h1 className="main-title">SearchX</h1>
      <SearchBar />
      <Outlet />
    </div>
  );
};
