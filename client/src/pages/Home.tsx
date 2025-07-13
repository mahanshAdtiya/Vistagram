import { Posts } from '@/components';
import { Outlet } from 'react-router-dom'
import {RightSidebar} from '@/components'

function HomePage() {
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <div className='flex-1 my-8 flex flex-col items-center pl-[5%]'>
          <Posts/>
        </div>
          <Outlet />
      </div>
      <RightSidebar />
    </div>

  );
}

export default HomePage;
