if("serviceWorker" in navigator){
    navigator.serviceWorker.register("service_worker.js").then(registration=>{
      console.log("SW Registered!");
        registration.showNotification("FeedIt", {
        body: "Notifications available.",
      });
    }).catch(error=>{
      console.log("SW Registration Failed", error);
    });
}else{
  console.log("Not supported");
}
