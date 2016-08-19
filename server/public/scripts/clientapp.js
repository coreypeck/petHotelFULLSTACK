$(document).ready(function() {
    getData();
    getOwners();
    $('.ownerRegistration').on("click", "button", registerOwner);
    $('.petRegister').on("click", "button", registerPet);
    $('#dataTable').on("click", ".checkInOut", checkInOutButton);
    $('#dataTable').on("click", ".delete", deleteData);
    $('#dataTable').on("click", ".update", updateData);
});

//functionality for delete button
function deleteData() {
    var petToDelete = $(this).attr("id");

    $.ajax({
        type: 'DELETE',
        url: '/pets/' + petToDelete,
        success: function() {
            console.log('DELETED bookID:', petToDelete);

            $('#dataTable').empty();
            $('#ownerName').empty();
            getData();
            getOwners();
        },
        error: function() {
            console.log("error in delete");
        }
    });
}
//updates specific data row if edited
function updateData() {
    var pet = {};
    var inputs = $(this).parent().children().serializeArray();
    $.each(inputs, function(i, field) {
        pet[field.name] = field.value;
    });

    console.log("update", pet);
    var petID = $(this).parent().attr('id');

    $.ajax({
        type: 'PUT',
        url: '/pets/' + petID,
        data: pet,
        success: function() {
            $('#dataTable').empty();
            $('#ownerName').empty();
            getData();
            getOwners();
        },
        error: function() {

        }
    });

}
//loads dropdown owner menu
function getOwners() {
    var petOwners = [];

    $.ajax({
        type: 'GET',
        url: '/pets/owners',
        success: function(ownerList) {
            console.log("OWNER LIST:!:@#:", ownerList);
            //console.log("bookList:", books);

            ownerList.forEach(function(owner, i) {
                if (petOwners.length === 0) {
                    petOwners.push({
                        id: owner.id,
                        name: owner.owner_firstname + " " + owner.owner_lastname
                    });
                } else {
                    var unique = true;
                    petOwners.forEach(function(ownerID, i) {
                        if (ownerID == owner.id) {
                            unique = false;
                        }
                    });
                    if (unique === true) {
                        petOwners.push({
                            id: owner.id,
                            name: owner.owner_firstname + " " + owner.owner_lastname
                        });
                    }
                }

            });
            $('#ownerName').empty();
            petOwners.forEach(function(owner, i) {
                $('#ownerName').append('<option id = ' + owner.id + ' value="' + owner.id + '">' + owner.name + '</option>');
            });
        },
        error: function() {
            console.log("/GET SELECTED OWNERS didntWork");
        }
    });
}
//toggle class function for checkin button
function checkInOutButton() {
    $(this).toggleClass("checkedIn");
    var petID = $(this).parent().attr('id');
    if ($(this).attr("class") == "checkInOut checkedIn") {
        $(this).text("Check Out");
        putVisitOut(petID);
    } else {
        $(this).text("Check In");
        putVisitIn(petID);
    }
}
//for submitting owner form
function registerOwner() {
    event.preventDefault();
    var owner = {};
    $.each($('#ownerReg').serializeArray(), function(i, field) {
        owner[field.name] = field.value;
    });
    console.log("Owner:", owner);
    if (owner.owner_lastname == "" || owner.owner_firstname == "") {
        alert("Fool ya Fool tryin to enter a blank field");
    } else {
        $.ajax({
            type: 'POST',
            url: '/pets/owners',
            data: owner,
            success: function() {
                console.log("owner was posted to db");
                $('#dataTable').empty();
                $('#ownerName').empty();
                getData();
                getOwners();
            },
            error: function() {
                console.log('/POST didnt work');
            }

        });
    }

}
//for submitting pet data
function registerPet() {
    event.preventDefault();
    var pet = {};
    var selected = ($("#ownerName option:selected").attr("id"));
    $.each($('#registerPet').serializeArray(), function(i, field) {
        pet[field.name] = field.value;
    });
    pet.pet_owner = selected;
    console.log("Pet:", pet);
    if (pet.pet_name == "" || pet.pet_breed == "" || pet.pet_color == "") {
        alert("Fool ya Fool tryin to enter a blank field");
    } else {
        $.ajax({
            type: 'POST',
            url: '/pets/petdetails',
            data: pet,
            success: function() {
                $('#dataTable').empty();
                getData();

            },
            error: function() {
                console.log('/POST didnt work');
            }

        });
    }
}
//loads table from db YEA
function getData() {
    $.ajax({
        type: 'GET',
        url: '/pets',
        success: function(data) {
            console.log('GET /pets returns:', data);
            var ownerName = "";
            data.forEach(function(owner) {
                var $el = $('<div id="' + owner.id + '"></div>');
                var ownerName = owner.owner_firstname + " " + owner.owner_lastname;
                owner.ownerName = ownerName;

                var dataTable = ['ownerName', 'pet_name', 'pet_breed', 'pet_color'];
                dataTable.forEach(function(property) {

                    var $input = $('<input type="text" id="' + property + '"name="' + property + '" />');
                    $input.val(owner[property]);
                    $el.append($input);

                });

                $el.append('<button id=' + owner.id + ' class="update">Update</button>');
                $el.append('<button id=' + owner.id + ' class="delete">Delete</button>');
                $el.append('<button id=' + owner.id + ' class="checkInOut">Check In</button>');

                $('#dataTable').append($el);
            });
        },

        error: function(response) {
            console.log('GET /PETSST fail. No PETS could be retrieved!');
        },
    });

}
function putVisitIn(petID){
  console.log(petID);
  postVisting(petID);
  $.ajax({
      type: 'PUT',
      url: '/pets/checkindate/' + petID,
      data: petID,
      success: function() {
          console.log("owner was posted to db");
      },
      error: function() {
          console.log('/POST didnt work');
      }

  });
}
function putVisitOut(petID){
  console.log(petID);
  postVisting(petID);
  $.ajax({
      type: 'PUT',
      url: '/pets/checkoutdate/' + petID,
      data: petID,
      success: function() {
          console.log("owner was posted to db");
      },
      error: function() {
          console.log('/POST didnt work');
      }

  });
}
function postVisting(pet){
  console.log(pet);
  $.ajax({
    type: 'POST',
    url: '/pets/checkedpet',
    data: pet,
    success: function(){
      console.log('Visiting Worked Fool!');
    },
    error: function(){
      console.log('Visiting didnt work');
    }
  })
}
