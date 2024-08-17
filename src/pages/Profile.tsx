import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const userInfo = [
    { title: "Name", value: user?.displayName },
    { title: "Email", value: user?.email },
    { title: "PhotoURL", value: user?.photoURL },
    { title: "Join Date", value: user?.metadata?.creationTime },
  ];
  if (!user) navigate("/");
  return (
    <div className="mx-auto border rounded-md max-w-[450px] text-gray-700 py-5 px-4 sm:px-8 my-7 overflow-hidden">
      <div className="text-center text-xl font-semibold">User Profile</div>
      <div className="flex text-center justify-center items-center mx-auto mt-7 mb-10 ring-2 ring-offset-1 ring-blue-300 rounded-full w-24 h-24 bg-orange-600">
        {user && user?.photoURL ? (
          <img
            src={user?.photoURL}
            alt="Profile Photo"
            width={140}
            height={60}
            className="rounded-full w-full h-full object-cover"
          />
        ) : (
          <span className="text-[48px] font-semibold text-white">
            {user?.displayName && user?.displayName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      {userInfo.map((info, index) => (
        <div key={index} className="flex items-center mt-3 w-full">
          <div className="w-28 flex-shrink-0 font-semibold text-green-700">
            {info.title}
          </div>
          <input
            value={info?.value || ""}
            readOnly
            className="border rounded outline-0 px-2 flex-grow h-10"
          />
        </div>
      ))}
    </div>
  );
};

export default Profile;
