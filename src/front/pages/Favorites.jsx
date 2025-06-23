import React from "react";

const dogData = [
    {
        id: 1,
        name: "charlie",
        breed: "some breed",
        location:"some location",
        image:"some url"
    }
]

export default Favorites =()=>{

    return(
        <div class="card" style="width: 18rem;">
  <img src={dogData.image} class="card-img-top" alt="..."/>
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
    )
}