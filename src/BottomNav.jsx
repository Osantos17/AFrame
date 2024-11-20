import './BottomNav.css'

export function BottomNav () {
  

  return (
    <div className="mt-0">
      <div className="navContainer flex justify-evenly items-center">
        <div className='Home flex flex-col items-center my-2'> 
          <img src="/src/Images/Kami.png" width="35" height="35"/>
          <h3 className='bottomNav items-center'>HOME</h3>
        </div>
        <div className='Search flex flex-col items-center my-2'> 
          <img src="/src/Images/Search.png" width="30" height="30"/>
          <h3 className='bottomNav items-center'>SEARCH</h3>
        </div>
        <div className='Account flex flex-col items-center my-2'> 
          <img src="/src/Images/Account.png" width="30" height="30"/>
          <h3 className='bottomNav items-center'>ACCOUNT</h3>
        </div>
      </div>
    </div>
  );
}