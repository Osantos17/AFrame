import './BottomNav.css'

export function BottomNav () {
  

  return (
    <div className="mt-0">
      <div className="navContainer flex justify-evenly items-center">
        <div className='Home my-2'> 
          <img src="./src/Images/Home.png" width="30" height="30"/>
        </div>
        <div className='Search my-2'> 
          <img src="./src/Images/Search.png" width="30" height="30"/>
        </div>
        <div className='Account my-2'> 
          <img src="./src/Images/Account.png" width="30" height="30"/>
        </div>
      </div>
    </div>
  );
}