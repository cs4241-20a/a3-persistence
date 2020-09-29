$(function(){
  $("#github-button").on('click', () => {
    console.log("Clicked")
    window.location.href = '/auth';
    return false;
  })
});