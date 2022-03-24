import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '../contexts/auth0-context';

function Home(): JSX.Element {
  let navigation = useNavigate()
  const { isAuthenticated, getIdTokenClaims, user } = useAuth0();
  const [users = [], setUsers] = useState();

  const deleteUser = async (id: string) => {
    const accessToken = await getIdTokenClaims();
    await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${id}`, {
      method: "delete",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "authorization": `Bearer ${accessToken.__raw}`
      })
    });
    _removeUserFromView(id);
    navigation('/');
  }

  const _removeUserFromView = (id: string) => {
    const index = users.findIndex((user: { _id: string; }) => user._id === id);
    users.splice(index, 1);
  }

  useEffect(() => {
    const fetchUsers = async (): Promise<any> => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user`);
      const json = await response.json();
      setUsers(json)
    }
    fetchUsers();
  }, [])
  return (
    <section className="blog-area section">
      <div className="container">
        <div className="row">
          {users && users.map((user: { firstName: string; _id: any; lastName: string; position:string, team:string }) => (
            <div className="col-lg-4 col-md-6" key={user._id}>
              <div className="card h-100">
                <div className="single-post post-style-1">
                  <div className="blog-info">
                    <h4 className="title">
                      <span>
                        <b>{user.firstName + ' ' + user.lastName}</b>
                        <b>{user.team}</b>
                      </span>
                    </h4>
                  </div>
                </div>
                <ul className="post-footer">
                  <li>
                    <Link to={`/user/${user._id}`} className="btn btn-sm btn-outline-secondary">View User </Link>
                  </li>
                  <li>
                    {
                      isAuthenticated &&
                      <Link to={`user/edit/${user._id}`} className="btn btn-sm btn-outline-secondary">Edit User </Link>
                    }
                  </li>
                  <li>
                    {
                      isAuthenticated &&
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => deleteUser(user._id)}>Delete User</button>
                    }
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;