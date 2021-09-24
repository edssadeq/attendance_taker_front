//URLS
const BASE_URL = "http://127.0.0.1:8080/";
const GET_All_COURSES_URL = BASE_URL+"courses";
const GET_All_MEETS_URL = BASE_URL+"meets";
const GET_All_PARTICIPANTS_URL = BASE_URL+"participants";
const GET_COURSE_MEETS_URL = BASE_URL+"meets/course=";
const GET_MEET_PARTICIPANTS_URL = BASE_URL+"participants/meet=";
const GET_PARTICIPANT_MEETS = BASE_URL+"meets/par=";

//DOM elements *****************

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
        getAllCoursesAndBuildTable();
        createAddingItemModel('course');
    }
    else if(data_to_show === 'meets'){
        editing_modal.innerHTML = "";
        getAllMeetsAndBuildTable();
        createAddingItemModel('meet');
    }
    else if (data_to_show === 'par'){
        editing_modal.innerHTML = "";
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
        table.innerHTML = createTableTemplate(["COURSE_ID", "COURSE_NAME", "COURSE_DESC", "MEETS_NUMBER"], data);
        courses_badge.textContent = data.length; //badge
    }).
    catch(err=>{
        console.log(err);
    });
}
function getAllMeetsAndBuildTable(){
    let res = getData(GET_All_MEETS_URL);
    res.then(data=> {
        table.innerHTML = createTableTemplate(["MEET_ID", "COURSE_ID", "MEET_DATE_TIME", "PAR_NUMBER", "MEET_ORGANISER", "MEET_NOTES"], data);
        meets_badge.textContent = data.length; //badge
    }).catch(err=>{
        console.log(err)
    });
}
//{"PAR_ID":"1","PAR_FNAME":"Essadeq","PAR_LNAME":"Elaamiri","PAR_EMAIL":"esasdqe@gmail.com"
function getAllParticipantAndBuildTable(){
    let res = getData(GET_All_PARTICIPANTS_URL);
    res.then(data=> {
        table.innerHTML = createTableTemplate(["PAR_ID", "PAR_FNAME", "PAR_LNAME", "PAR_EMAIL"], data);
        par_badge.textContent = data.length; //badge
    }).catch(err=>{
        console.log(err)
    });
}


// handle more info track...
document.addEventListener("click", (event)=>{
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

})

function getCourseMeetsAndBuildTable(course_id){
    let url = GET_COURSE_MEETS_URL+course_id;
    getData(url).then(data=>{
        let theaders= ["MEET_ID", "MEET_DATE_TIME", "MEET_ORGANISER"];
        let destructed_data = [];
        for (let meet in data){
            let {MEET_ID, MEET_DATE_TIME, MEET_ORGANISER} = data[meet];
            let new_data = {MEET_ID, MEET_DATE_TIME, MEET_ORGANISER};
            destructed_data.push(new_data);
        }
        more_info_table_1.innerHTML = createTableTemplate(theaders, destructed_data);

    }).catch(err=>{
        console.log(err);
    })
}

function getMeetParticipantsAndBuildTable(meet_id){
    let url = GET_MEET_PARTICIPANTS_URL+meet_id;
    getData(url).then(data=>{
        let theaders= ["PAR_ID", "PAR_FNAME", "PAR_LNAME", "PAR_EMAIL"];
        more_info_table_2.innerHTML = createTableTemplate(theaders, data);

    }).catch(err=>{
        console.log(err);
    })
}

function getParticipantMeetsAndBuildTable(par_id){
    let url = GET_PARTICIPANT_MEETS+par_id;
    getData(url).then(data=>{
        let theaders= ["MEET_ID", "MEET_DATE_TIME", "MEET_ORGANISER"];
        let destructed_data = [];
        for (let meet in data){
            let {MEET_ID, MEET_DATE_TIME, MEET_ORGANISER} = data[meet];
            let new_data = {MEET_ID, MEET_DATE_TIME, MEET_ORGANISER};
            destructed_data.push(new_data);
        }
        more_info_table_1.innerHTML = createTableTemplate(theaders, destructed_data);

    }).catch(err=>{
        console.log(err);
    })
}


//handle control modals
function createAddingItemModel(operations_item){
    if(operations_item == 'course'){
        modal_modal.innerHTML = getAddCourseModal();
        add_btn.setAttribute('data-bs-target',"#add_course_modal")
    }
    if(operations_item == 'meet'){
        modal_modal.innerHTML = getAddMeetModal();
        add_btn.setAttribute('data-bs-target',"#add_meet_modal")
    }
    if(operations_item == 'par'){
        modal_modal.innerHTML = getAddParticipantModal();
        add_btn.setAttribute('data-bs-target',"#add_par_modal")
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
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Course name</span>
                  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Meets Number</span>
                  <input type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="(-1) if you are not sure">
                </div>
                <div class="input-group-sm">
                  <span class="input-group-text">Course description</span>
                  <textarea class="form-control" aria-label="With textarea"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" class="add_course_btn">ADD COURSE</button>
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
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Meet ID</span>
                  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Course ID</span>
                  <input type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Date time</span>
                  <input type="datetime-local" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Participants</span>
                  <input type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Organiser</span>
                  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group-sm">
                  <span class="input-group-text">Meet notes</span>
                  <textarea class="form-control" aria-label="With textarea"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" class="add_meet_btn">ADD MEET</button>
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
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">First name</span>
                  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Last Name</span>
                  <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
                <div class="input-group input-group-sm mb-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Email</span>
                  <input type="email" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" class="add_par_btn">ADD PARTICIPANT</button>
              </div>
            </div>
          </div>
        </div>
    `;
    return template;
}

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
                <button type="button" class="btn btn-primary" data-edit_course_id = "${data.COURSE_ID}">Save changes</button>
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
                <button type="button" class="btn btn-primary" data-edit_meet_id="${data.MEET_ID}">Save changes</button>
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
                <button type="button" class="btn btn-primary" data-edit_par_id="${data.PAR_ID}">Save changes</button>
              </div>
            </div>
          </div>
        </div>
    `;
    return template;
}


//general purpose functions
async function getData(url){
    let response = await fetch(url);
    return response.json();
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
                <button type="button" class="btn btn-danger btn-sm">&#10006;</button>
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

