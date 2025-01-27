import React from "react";
import "./Profile.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../../Context/Context";

export default function Profile() {
  let Navigate = useNavigate();

  const { isFetching, error, token, dispatch } = useContext(Context);

  const [data, setdata] = useState("");
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [profilephoto, setprofilephoto] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/user/getdata", {
        headers: {
          token,
        },
      })
      .then((res) => {
        setdata(res.data.data[0]);
        setusername(res.data.data[0].username);
        setemail(res.data.data[0].email);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formdata = new FormData();

    formdata.append("email", email);
    formdata.append("username", username);
    formdata.append("profilephoto", profilephoto);
    dispatch({ type: "UPDATE_USER_START" });
    try {
      await axios.patch("http://localhost:8000/user/update", formdata, {
        headers: { token },
      });
      dispatch({ type: "UPDATE_USER_SUCCESS" });
    } catch (err) {
      dispatch({ type: "UPDATE_USER_FAIL" });
    }
    Navigate("/");
  };

  const deleteHandler = async () => {
    dispatch({ type: "DELETE_USER_START" });
    try {
      await axios.delete("http://localhost:8000/user/delete", {
        headers: { token },
      });
      dispatch({ type: "DELETE_USER_SUCCESS" });
      dispatch({ tyoe: "LOGOUT" });
      Navigate("/");
    } catch (err) {
      dispatch({ type: "DELETE_USER_FAIL" });
    }
  };

  if (isFetching) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  if (token === null) {
    return (
      <div>
        please <a href="/login">login</a>
      </div>
    );
  }

  return (
    <>
      <div className="profile_navigate">
        <a href="/">Home</a>
      </div>
      <div className="profile_div">
        <img
          src={`http://localhost:8000/profilephoto/${data.profilePhoto}`}
          alt=""
        />
        <form
          className="profile_form"
          encType="multipart/form-data"
          onSubmit={submitHandler}
        >
          <input
            type="text"
            value={username}
            name="username"
            placeholder="username"
            onChange={(e) => {
              setusername(e.target.value);
            }}
            required
          />
          <input
            type="text"
            value={email}
            name="email"
            placeholder="email"
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />
          <input
            type="file"
            name="profilephoto"
            onChange={(e) => {
              setprofilephoto(e.target.files[0]);
            }}
          />
          <button className="profile_form_button">Update</button>
        </form>
        <button className="profile_form_button" onClick={deleteHandler}>
          Delete
        </button>
      </div>
    </>
  );
}
