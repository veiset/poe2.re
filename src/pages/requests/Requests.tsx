import vendorIcon from "@/img/whetstone_inventory_icon.png";
import waystoneIcon from "@/img/waystone_inventory_icon.png";
import tabletIcon from "@/img/precursortablet_inventory_icon.png";

const Requests = () => {
  return (
    <div>
      <h1 className="flex items-center justify-center lg:text-3xl pt-10">Path of Exile 2 Regex</h1>
      <p className="flex items-center justify-center pt-10">
        Currently in early development. New features will be added as the game is explored.
      </p>
      <p className="flex items-center justify-center">
        Please use Github to suggest features that would be nice to have or issues you find.
      </p>

      <h2 className="flex items-center justify-center lg:text-2xl pt-10">Current features:</h2>
      <p className="flex items-center justify-center pt-5">
        <div>
          <a href="/vendor" className="flex">
            <img src={vendorIcon} alt="vendor regex" width="32" height="32"/>
            <span>Vendor Regex</span>
          </a>
        </div>
      </p>
      <p className="flex items-center justify-center pt-5">
        <div>
          <a href="/waystone" className="flex">
            <img src={waystoneIcon} alt="waystone regex" width="32" height="32"/>
            <span>Waystone Regex</span>
          </a>
        </div>
      </p>
      <p className="flex items-center justify-center pt-5">
        <div>
          <a href="/tablet" className="flex">
            <img src={tabletIcon} alt="tablet regex" width="32" height="32"/>
            <span>Tablet Regex</span>
          </a>
        </div>
      </p>

    </div>
  )
}

export default Requests;