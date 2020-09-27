let formData;

//need to make the form data same as logicArr!!
$("form").submit(e=>{
    formData = $("form").serializeArray();
    console.log("formData is below")
    console.log(formData);

    // e.preventDefault();
})

module.exports = formData;

 