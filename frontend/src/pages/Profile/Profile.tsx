import { Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteUser } from "../../common/api/profile";
import Page from "../../common/components/Page/Page";
import { UserData } from "./UserData";

export function Profile() {
  const nav = useNavigate();

  function deleteMyUser() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          nav("/logout");
        } else {
          try {
            await deleteUser({ userEmail });
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            nav("/logout");
          } catch (e: any) {
            // Error message
            console.log(e);
            let response = e.response?.data?.statusMessage;
            Swal.fire("Error!", response, "error");
          }
        }
      }
    });
  }

  return (
    <Page>
      <>
        <UserData />
        <Card className="m-auto border-0" style={{ width: "18rem" }}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <button onClick={() => deleteMyUser()} className="btn btn-danger">
                Delete my profile
              </button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </>
    </Page>
  );
}
