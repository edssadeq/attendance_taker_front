//URLS
const BASE_URL = "http://127.0.0.1:8080/";
const GET_All_COURSES_URL = BASE_URL+"courses";
const GET_All_MEETS_URL = BASE_URL+"meets";
const GET_All_PARTICIPANTS_URL = BASE_URL+"participants";
const GET_COURSE_MEETS_URL = BASE_URL+"meets/course=";
const GET_MEET_PARTICIPANTS_URL = BASE_URL+"participants/meet=";
const GET_PARTICIPANT_MEETS = BASE_URL+"meets/par=";


//DOM elements *****************
let alerts_div = document.getElementById("alerts_div");
//add click listener to .sidebar buttons
let sidebar_buttons = document.querySelectorAll('.clickable');
let title = document.getElementById("title_");
let table = document.getElementById("data_table");
//badges
let courses_badge = document.getElementById('courses_badge');
let meets_badge = document.getElementById('meets_badge');
let par_badge = document.getElementById('par_badge');

let more_info_title_1 = document.getElementById("more_info_title_1");
let more_info_table_1 = document.getElementById("more_info_table_1");
let more_info_title_2 = document.getElementById("more_info_title_2");
let more_info_table_2 = document.getElementById("more_info_table_2");

let modal_modal = document.getElementById("modal_modal");
let add_btn = document.getElementById("add_btn");
let editing_modal = document.getElementById("editing_modal");
let deleting_modal = document.getElementById("deleting_modal");

//modal buttons
let add_course_btn = document.getElementById("add_course_btn");

sidebar_buttons.forEach(btn=>{
    btn.addEventListener('click', changeData);
})

function  changeData(){
    more_info_table_1.innerHTML = "";
    more_info_table_2.innerHTML = "";
    more_info_title_1.textContent = "";
    more_info_title_2.textContent = "";

    let data_to_show = this.getAttribute('data-data_to_show');
    //console.log(data_to_show);
    title.textContent = this.textContent.toUpperCase();
    if(data_to_show === 'courses'){
        editing_modal.innerHTML = "";
        deleting_modal.innerHTML = "";
        getAllCoursesAndBuildTable();
        createAddingItemModel('course');
    }
    else if(data_to_show === 'meets'){
        editing_modal.innerHTML = "";
        deleting_modal.innerHTML = "";
        getAllMeetsAndBuildTable();
        createAddingItemModel('meet');
    }
    else if (data_to_show === 'par'){
        editing_modal.innerHTML = "";
        deleting_modal.innerHTML = "";
        getAllParticipantAndBuildTable();
        createAddingItemModel('par');
    }
}

window.addEventListener('load', ()=>{
    getAllCoursesAndBuildTable();
    createAddingItemModel('course');
});

function getAllCoursesAndBuildTable(){
    let res = getData(GET_All_COURSES_URL);
    res.then(data=> {
        if(!data){
            table.innerHTML = getAlert("info", "No data Found")
            courses_badge.textContent = '0'; //badge
        }
        else{
            table.innerHTML = createTableTemplate(["COURSE_ID", "COURSE_NAME", "COURSE_DESC", "MEETS_NUMBER"], data);
            courses_badge.textContent = data.length; //badge
        }
    }).
    catch(err=>{
        console.log(err);
    });
}
function getAllMeetsAndBuildTable(){
    let res = getData(GET_All_MEETS_URL);
    res.then(data=> {
        if(!data){
            table.innerHTML = getAlert("info", 'No data Found');
            meets_badge.textContent = '0'; //badge

        }else{
            table.innerHTML = createTableTemplate(["MEET_ID", "COURSE_ID", "MEET_DATE_TIME", "PAR_NUMBER", "MEET_ORGANISER", "MEET_NOTES"], data);
            meets_badge.textContent = data.length; //badge
        }
    }).catch(err=>{
        console.log(err)
    });
}
//{"PAR_ID":"1","PAR_FNAME":"Essadeq","PAR_LNAME":"Elaamiri","PAR_EMAIL":"esasdqe@gmail.com"
function getAllParticipantAndBuildTable(){
    let res = getData(GET_All_PARTICIPANTS_URL);
    res.then(data=> {
        if(!data){
            table.innerHTML = getAlert('info', 'No data Found')
            par_badge.textContent = '0'; //badge
        }
        else{
            table.innerHTML = createTableTemplate(["PAR_ID", "PAR_FNAME", "PAR_LNAME", "PAR_EMAIL"], data);
            par_badge.textContent = data.length; //badge
        }
    }).catch(err=>{
        console.log(err)
    });
}


// handle all clicks hhhh
document.addEventListener("click", (event)=>{
    event.stopPropagation();
    let clicked_html_elm = event.target.parentElement; //getting <tr>
    if(clicked_html_elm.matches("[data-course_id]")){
        //console.log(clicked_html_elm.getAttribute("data-course_id"));
        //getting course meets
        //get course id
        let course_id = clicked_html_elm.getAttribute("data-course_id");
        more_info_title_1.innerHTML = "Course <span class=\"badge bg-primary\">ID: "+ course_id +"</span> Meets ";
        getCourseMeetsAndBuildTable(course_id);


    }
    if(clicked_html_elm.matches("[data-meet_id]")){
        //console.log(clicked_html_elm.getAttribute("data-meet_id"));
        let meet_id = clicked_html_elm.getAttribute("data-meet_id");
        more_info_title_2.innerHTML = "Meet <span class=\"badge bg-primary\">ID: "+meet_id+"</span> Participants";
        getMeetParticipantsAndBuildTable(meet_id);

    }
    if(clicked_html_elm.matches("[data-par_id]")){
        //console.log(clicked_html_elm.getAttribute("data-par_id"));
        let par_id = clicked_html_elm.getAttribute("data-par_id");
        more_info_title_1.innerHTML = "Participant <span class=\"badge bg-primary\">ID: "+par_id+"</span> Meets";
        getParticipantMeetsAndBuildTable(par_id);


    }
    //handle adding item action
    // if(clicked_html_elm.matches("#add_course_btn")){
    //     console.log(clicked_html_elm);
    // }
    // if(clicked_html_elm.matches("#add_meet_btn")){
    //     console.log(clicked_html_elm);
    // }
    // if(clicked_html_elm.matches("#add_par_btn")){
    //     console.log(clicked_html_elm);
    // }
    //console.log(clicked_html_elm);

})


function getCourseMeetsAndBuildTable(course_id){
    let url = GET_COURSE_MEETS_URL+course_id;
    getData(url).then(data=>{
        if(data.length <= 0 || !data ){
            more_info_table_1.innerHTML = getAlert('info', 'No data found');

        }else{
            let theaders= ["MEET_ID", "MEET_DATE_TIME", "MEET_ORGANISER"];
            let destructed_data = [];
            for (let meet in data){
                let {MEET_ID, MEET_DATE_TIME, MEET_ORGANISER} = data[meet];
                let new_data = {MEET_ID, MEET_DATE_TIME, MEET_ORGANISER};
                destructed_data.push(new_data);
            }
            more_info_table_1.innerHTML = createTableTemplate(theaders, destructed_data);
        }

    }).catch(err=>{
        console.log(err);
    })
}

function getMeetParticipantsAndBuildTable(meet_id){
    let url = GET_MEET_PARTICIPANTS_URL+meet_id;
    getData(url).then(data=>{
        if(data.length <= 0 || !data ){
            more_info_table_2.innerHTML = getAlert('info', 'No data Found');
        }
        else{
            let theaders= ["PAR_ID", "PAR_FNAME", "PAR_LNAME", "PAR_EMAIL"];
            more_info_table_2.innerHTML = createTableTemplate(theaders, data);
        }

    }).catch(err=>{
        console.log(err);
    })
}

function getParticipantMeetsAndBuildTable(par_id){
    let url = GET_PARTICIPANT_MEETS+par_id;
    getData(url).then(data=>{
        if(data.length <= 0 || !data ){
            more_info_table_1.innerHTML = getAlert('info', 'No data Found');
        }else{
            let theaders= ["MEET_ID", "MEET_DATE_TIME", "MEET_ORGANISER"];
            let destructed_data = [];
            for (let meet in data){
                let {MEET_ID, MEET_DATE_TIME, MEET_ORGANISER} = data[meet];
                let new_data = {MEET_ID, MEET_DATE_TIME, MEET_ORGANISER};
                destructed_data.push(new_data);
            }
            more_info_table_1.innerHTML = createTableTemplate(theaders, destructed_data);
        }

    }).catch(err=>{
        console.log(err);
    })
}


//handle control modals
//adding
function createAddingItemModel(operations_item){
    if(operations_item == 'course'){
        modal_modal.innerHTML = getAddCourseModal();
        add_btn.setAttribute('data-bs-target',"#add_course_modal")
    }
    if(operations_item == 'meet'){
        modal_modal.innerHTML = getAddMeetModal();
        //get select dom element
        let MEET_COURSE_ID = document.getElementById('MEET_COURSE_ID') //fill in select course
        let course_select = "";
        getData(GET_All_COURSES_URL).then(data=>{
            for(let i in data){
                course_select +=  `<option value="${data[i].COURSE_ID}">${data[i].COURSE_ID}-${data[i].COURSE_NAME}</option>`
            }
            MEET_COURSE_ID.innerHTML = course_select;
        }).catch(err=>{
            console.log(err);
        })

        add_btn.setAttribute('data-bs-target',"#add_meet_modal") //linking modal with button
    }
    if(operations_item == 'par'){
        modal_modal.innerHTML = getAddParticipantModal(); //inject modal
        //adding courses list
        let PAR_COURSES_ID = document.getElementById('PAR_COURSES_ID') //fill in select course
        let PAR_MEETS_ID = document.getElementById('PAR_MEETS_ID') //fill in select course


        let course_select = "";
        getData(GET_All_COURSES_URL).then(data=>{
            for(let i in data){
                course_select +=  `<option value="${data[i].COURSE_ID}">${data[i].COURSE_ID}-${data[i].COURSE_NAME}</option>`
            }
            PAR_COURSES_ID.innerHTML = course_select;
        }).catch(err=>{
            console.log(err);
        })

        let meet_select = "";
        getData(GET_All_MEETS_URL).then(data=>{
            for(let i in data){
                meet_select +=  `<option value="${data[i].MEET_ID}">${data[i].MEET_ID}-[Date: ${data[i].MEET_DATE_TIME}]</option>`
            }
            PAR_MEETS_ID.innerHTML = meet_select;
        }).catch(err=>{
            console.log(err);
        })
        add_btn.setAttribute('data-bs-target',"#add_par_modal") //to change the modal to point to
    }

}

//modals
function getAddCourseModal(){
    let template = `
        <div class="modal fade" id="add_course_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">ADD COURSE</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
               <div id="Modal_alert">
                    
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Course name</span>
                  <input id="COURSE_NAME" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Meets Number</span>
                  <input id="MEETS_NUMBER" type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="(-1) if you are not sure">
                </div>
                <div class="input-group-sm">
                  <span class="input-group-text">Course description</span>
                  <textarea id="COURSE_DESC" class="form-control" aria-label="With textarea"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="add_course_btn" onclick="addCourse(this)">ADD COURSE</button>
              </div>
            </div>
          </div>
        </div>
    `;
    return template;
}
function getAddMeetModal(){

    let template = `
        <div class="modal fade" id="add_meet_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">ADD MEET</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
               <div id="Modal_alert">
                    
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Meet ID</span>
                  <input id="MEET_ID" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Course ID</span>
                    <!--<input id="MEET_COURSE_ID" type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >-->
                    <select class="form-select form-select-sm" id="MEET_COURSE_ID" aria-label=".form-select-sm example">  </select>  
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Date time</span>
                  <input id="MEET_DATE_TIME" type="datetime-local" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Participants</span>
                  <input id="PAR_NUMBER" type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Organiser</span>
                  <input id="MEET_ORGANISER" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group-sm">
                  <span class="input-group-text">Meet notes</span>
                  <textarea id="MEET_NOTES" class="form-control" aria-label="With textarea"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="add_meet_btn" onclick="addMeet(this)">ADD MEET</button>
              </div>
            </div>
          </div>
        </div>
    `;
    return template;
}
function getAddParticipantModal(){
    let template = `
        <div class="modal fade" id="add_par_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">ADD PARTICIPANT</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              
              <div class="modal-body">
                <div id="Modal_alert"> </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">First name</span>
                  <input id="PAR_FNAME" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Last Name</span>
                  <input id="PAR_LNAME" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Email</span>
                  <input id="PAR_EMAIL" type="email" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Course(s) ID</span>
                    <select class="form-select form-select-sm" id="PAR_COURSES_ID" multiple  aria-label=".form-select-sm example multiple ">  </select>  
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Meet(s) ID</span>
                    <select class="form-select form-select-sm" id="PAR_MEETS_ID" multiple aria-label=".form-select-sm example multiple ">  </select>  
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="add_par_btn" onclick="addParticipant(this)">ADD PARTICIPANT</button>
              </div>
            </div>
          </div>
        </div>
    `;
    return template;
}

//Editing
function injectingEditModals(obj){
     let first_key = Object.keys(obj)[0];
     if(first_key === 'COURSE_ID'){
         editing_modal.innerHTML += getCourseEditModal(obj);
     }
     if(first_key === 'MEET_ID'){
         editing_modal.innerHTML += getMeetEditModal(obj);
     }
     if(first_key === 'PAR_ID'){
         editing_modal.innerHTML += getParticipantEditModal(obj);
     }
}

function getCourseEditModal(data){
    let template = `
        <div class="modal fade" id="edit_${Object.keys(data)[0]}_${Object.values(data)[0]}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">EDIT COURSE</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Course name</span>
                  <input type="text" value="${data.COURSE_NAME}" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Meets Number</span>
                  <input type="number" value="${data.MEETS_NUMBER}" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="(-1) if you are not sure">
                </div>
                <div class="input-group-sm">
                  <span class="input-group-text">Course description</span>
                  <textarea class="form-control" value="${data.COURSE_DESC}" aria-label="With textarea"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-edit_course_id = "${data.COURSE_ID}" onclick="editCourse(this)">Save changes</button>
              </div>
            </div>
          </div>
        </div>
    `;
    return template;
}
function getMeetEditModal(data){
    let template = `
        <div class="modal fade" id="edit_${Object.keys(data)[0]}_${Object.values(data)[0]}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">EDIT MEET</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Meet ID</span>
                  <input type="text" class="form-control" value="${data.MEET_ID}" disabled aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Course ID</span>
                  <input type="number" class="form-control" value="${data.COURSE8ID}" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Date time</span>
                  <input type="text" class="form-control" value="${data.MEET_DATE_TIME}" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Participants</span>
                  <input type="number" class="form-control" value="${data.PAR_NUMBER}" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Organiser</span>
                  <input type="text" class="form-control" value="${data.MEET_ORGANISER}" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group-sm">
                  <span class="input-group-text">Meet notes</span>
                  <textarea class="form-control" value="${data.MEET_NOTES}"  aria-label="With textarea"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-edit_meet_id="${data.MEET_ID}" onclick="editMeet(this)">Save changes</button>
              </div>
            </div>
          </div>
        </div>
    `;
    return template;
}
function getParticipantEditModal(data){
    let template = `
        <div class="modal fade" id="edit_${Object.keys(data)[0]}_${Object.values(data)[0]}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">EDIT PARTICIPANT</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">First name</span>
                  <input type="text" class="form-control" value="${data.PAR_FNAME}" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Last Name</span>
                  <input type="text" class="form-control" value="${data.PAR_LNAME}" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Email</span>
                  <input type="email" class="form-control" value="${data.PAR_EMAIL}" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-edit_par_id="${data.PAR_ID}" onclick="editParticipant(this)">Save changes</button>
              </div>
            </div>
          </div>
        </div>
    `;
    return template;
}

//delete
function injectingDeleteModals(data_obj){
    deleting_modal.innerHTML += getDeleteItemModal(data_obj);
}
function getDeleteItemModal(data_obj){

    let template = `
        <!-- Modal -->
        <div class="modal fade" id="delete_${Object.keys(data_obj)[0]}_${Object.values(data_obj)[0]}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">DELETE ITEM</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                 <p>Are you sure, want to delete <span class=" text-primary ">${Object.keys(data_obj)[0]}: ${Object.values(data_obj)[0]}</span> ?.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" data-delete_${Object.keys(data_obj)[0]}="${Object.values(data_obj)[0]}" onclick="deleteItem(this)">DELETE</button>
              </div>
            </div>
          </div>
        </div>
    `;

    return template;
}


//modal action
//add
function addCourse(target){
    /*
    get inputs data
    validate data
    //insert by URL
     */
    //get inputs data
    let course_name = document.getElementById('COURSE_NAME');
    let meets_number = document.getElementById('MEETS_NUMBER');
    let course_desc = document.getElementById('COURSE_DESC');

    let Modal_alert = document.getElementById('Modal_alert');


    let input_data = {
        COURSE_NAME : course_name.value,
        MEETS_NUMBER : meets_number.value,
        COURSE_DESC : course_desc.value,
    }
    //validate data
    if (input_data.COURSE_NAME.length <= 0){
        course_name.classList.add('error_border');
        Modal_alert.innerHTMl = getAlert('danger', 'Course name required !');
        return;
    }
    if(!input_data.MEETS_NUMBER || input_data.MEETS_NUMBER == -1 || input_data.MEETS_NUMBER == 0){
        input_data.MEETS_NUMBER = null;
    }
    if(input_data.COURSE_DESC.length <=0 ){
        input_data.COURSE_DESC = null;
    }
    // console.log(input_data);
    // console.log(JSON.stringify(input_data));
    //insert by URL
    postData(GET_All_COURSES_URL, input_data).then(res=>{
        if(res){
            sendAlert('success', 'Course created successfully');
            closeModal(target);
        }
    }).catch(err=>{
        sendAlert('danger', 'Error: Course not created, please try again !');
        closeModal(target);
    })

}
function addMeet(target){
    /*
    get inputs data
    validate data
    //insert by URL
     */
    //get inputs data
    let meet_id = document.getElementById('MEET_ID');
    let meet_course_id = document.getElementById('MEET_COURSE_ID');
    let meet_date_time = document.getElementById('MEET_DATE_TIME');
    let participant_number = document.getElementById('PAR_NUMBER');
    let meet_organiser = document.getElementById('MEET_ORGANISER');
    let meet_notes = document.getElementById('MEET_NOTES');

    let Modal_alert = document.getElementById('Modal_alert');

    let input_data = {
        MEET_ID: meet_id.value,
        MEET_COURSE_ID: meet_course_id.value,
        MEET_DATE_TIME: meet_date_time.value,
        PAR_NUMBER: participant_number.value,
        MEET_ORGANISER: meet_organiser.value,
        MEET_NOTES: meet_notes.value
    }
    //validate data
    if (input_data.MEET_ID.length <= 0 ||  /\s/.test(input_data.MEET_ID)){ //no white space
        meet_id.classList.add('error_border');
        Modal_alert.innerHTMl = getAlert('danger', 'Meet id required !');
        return;
    }
    if(input_data.MEET_DATE_TIME.length <= 0){
        meet_date_time.classList.add('error_border');
        Modal_alert.innerHTMl = getAlert('danger', 'Meet date time required !');
        return;
    }
    if(isNaN(input_data.MEET_COURSE_ID) || Number(input_data.MEET_COURSE_ID) <= 0){
        input_data.MEET_COURSE_ID = null;
    }
    if(input_data.MEET_ORGANISER.length <= 0){
        input_data.MEET_ORGANISER = null;
    }
    if(input_data.MEET_NOTES.length <= 0){
        input_data.MEET_NOTES = null;
    }
    if(isNaN(input_data.PAR_NUMBER) || Number(input_data.PAR_NUMBER) <= 0){
        input_data.MEET_ORGANISER = null;
    }
    input_data.MEET_COURSE_ID =  Number(input_data.MEET_COURSE_ID);
    console.log(input_data); ////////
    console.log(JSON.stringify(input_data)); ////////
    //insert by URL
    postData(GET_All_MEETS_URL, input_data).then(res=>{
        if(res){
            sendAlert('success', 'Meet created successfully');
            closeModal(target);
        }
        else{
            sendAlert('warning', 'Meet not created successfully [status: '+res+']');
            closeModal(target);
        }
    }).catch(err=>{
        sendAlert('danger', 'Error: Meet not created, please try again !');
        closeModal(target);
    })
}
function addParticipant(target){
    /*
    get inputs data
    validate data
    //insert by URL
     */
    //get inputs data
    let par_fname = document.getElementById('PAR_FNAME');
    let par_lname = document.getElementById('PAR_LNAME');
    let par_email = document.getElementById('PAR_EMAIL');

    let par_meets = document.getElementById('PAR_MEETS_ID');
    let par_courses = document.getElementById('PAR_COURSES_ID');

    let Modal_alert = document.getElementById('Modal_alert');

    let selected_courses = [];
    let selected_meets = [];

    for (let op of par_meets.options){
        if(op.selected) selected_meets.push(op.value)
    }

    for (let op of par_courses.options){
        if(op.selected) selected_courses.push(op.value)
    }

    let input_data = {
        PAR_FNAME: par_fname.value,
        PAR_LNAME: par_lname.value,
        PAR_EMAIL: par_email.value,
        PAR_COURSES_ID: selected_courses,
        PAR_MEETS_ID: selected_meets,
    }
    //validate data
    console.log(input_data);
    if (input_data.PAR_FNAME.length <= 0){
        par_fname.classList.add('error_border');
        Modal_alert.innerHTMl = getAlert('danger', 'Participant first name is required !');
        return;
    }
    if(input_data.PAR_LNAME.length <= 0){
        par_lname.classList.add('error_border');
        Modal_alert.innerHTMl = getAlert('danger', 'Participant last name is required !');
        return;
    }
    if(input_data.PAR_EMAIL.length <= 0 || !/^\S+@\S+\.\S+$/.test(input_data.PAR_EMAIL)){
        par_email.classList.add('error_border');
        Modal_alert.innerHTMl = getAlert('danger', 'Participant email  is required !');
        return;
    }

    //insert by URL
    postData(GET_All_PARTICIPANTS_URL, input_data).then(res=>{
        if(res){
            sendAlert('success', 'Participant created successfully');
            closeModal(target);
        }
        else{
            sendAlert('warning', 'Participant not created successfully [status: '+res+']');
            closeModal(target);
        }
    }).catch(err=>{
        sendAlert('danger', 'Error: Participant not created, please try again !');
        closeModal(target);
    })
}

//edit
function editCourse(target){
    console.log(target);
}
function editMeet(target){
    console.log(target);
}
function editParticipant(target){
    console.log(target);
}

//delete
function deleteItem(target){
    let item_id = '';
    let url ='';
    let item_ = 0;
    if(target.matches('[data-delete_course_id]')){
        item_id = target.getAttribute('data-delete_course_id');
        url = GET_All_COURSES_URL+'/'+item_id;

    }
    else if(target.matches('[data-delete_meet_id]')){
        item_id = target.getAttribute('data-delete_meet_id');
        url = GET_All_MEETS_URL+'/'+item_id;
        item_ = 1;
    }
    else if(target.matches('[data-delete_par_id]')){
        item_id = target.getAttribute('data-delete_par_id');
        url = GET_All_PARTICIPANTS_URL+'/'+item_id;
        item_ = 2;
    }
    else{
        sendAlert('warning', 'There is something wrong, item have not been deleted!');
        closeModal(target);

        return;
    }

    deleteData(url).then(res=>{
        if(res){
            sendAlert('success', 'Item has been deleted!');
            closeModal(target);
            sidebar_buttons[item_].click(); //updating view
        }
        else{
            sendAlert('error', 'There is an error, item have not been deleted!');
            closeModal(target);
        }
    }).catch(err=>{
        console.log(err);
    })

    //deleteData()
}



//general purpose functions
async function getData(url){
    let response = await fetch(url);
    if(response.status == 200){
        return response.json();
    }
    return null;
}
async function postData(url, data){
    let options ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    let response = await fetch(url, options);
    //return response.json();
    return response.status == 200 || response.status == 201;
}
async function deleteData(url){
    let options ={
        method: 'DELETE',
    }
    let response = await fetch(url, options);
    //return response.json();
    return response.status == 200 || response.status == 201;
}

function createTableTemplate(theaders, data){
    /*
    theaders : array of tables headers
    data : array of objects
     */
    let thead = "";
    for (let th in theaders ){
        thead += `<th scope=\"col\" data-content=\"${theaders[th]}\" >${theaders[th]}</th>`;
    }
    thead += `<th>ACTIONS</th>`
    let table_thead = `
        <thead>
        <tr>
            ${thead}
        </tr>
        </thead>
    `;

    let trs = "";
    let tds = "";
    for (let obj in data){
        Object.entries(data[obj]).forEach(ent =>{
            tds += `
                <td data-${ent[0]}=\"${ent[1]}\">${ent[1]}</td>
            `;
        });
        //&#10006; x sign
        //&#128465;
        let actions_td = `
            <td>
                <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#edit_${Object.keys(data[obj])[0]}_${Object.values(data[obj])[0]}">&#9999;</button>
                <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#delete_${Object.keys(data[obj])[0]}_${Object.values(data[obj])[0]}">&#10006;</button>
            </td>
        `;
        tds+= actions_td;
        trs+= `
            <tr data-${Object.keys(data[obj])[0]}=\"${Object.values(data[obj])[0]}\">
                ${tds}
            </tr>
        `;
        tds = "";

        //adding modals to document
        // if(editing_data[0]){injectingEditModals(editing_data[obj])}
        // else {injectingEditModals(data[obj]);}
        injectingEditModals(data[obj]);
        injectingDeleteModals(data[obj]);

    }

    let table_tbody = `
                <tbody>
                    ${trs}
                </tbody>                    
    `;

    return `
        ${table_thead}
        ${table_tbody}
    `
}

function sendAlert(type= "success", message ){
    alerts_div.innerHTML =  `<div class="alert alert-${type}" role="alert">
                              ${message}
                            </div>
`;
    setTimeout(()=>{
        alerts_div.innerHTML=""
    }, 3000);
}
function getAlert(type="success", message){
    let alert_div = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    return alert_div;
}
function closeModal(neighbour_node){
    neighbour_node.parentElement.firstElementChild.click();
}