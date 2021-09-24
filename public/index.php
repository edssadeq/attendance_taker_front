<?php
$loggedinUserName = null;
include_once __DIR__."/../src/index_src.php";
$page_title = "HOME";
include_once __DIR__."/views/partials/header.php";

?>

<?php include_once __DIR__."/views/partials/navbar.php" ?>


<!--affichages des course-->
<div class="container">
    <div class="row mb-5 mt-5">
        <div class="col text-center">
            <h2>Check Attendance</h2>
        </div>
    </div>
    <main>
        <div class="row">
            <div class="col col-12  col-md-2">
                <ol class="list-group list-group-numbered">
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold clickable" data-data_to_show="courses">
                                Courses
                            </div>
                        </div>
                        <span class="badge bg-primary rounded-pill" id="courses_badge">_</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold clickable" data-data_to_show="meets">
                                Meets
                            </div>

                        </div>
                        <span class="badge bg-primary rounded-pill" id="meets_badge">_</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold clickable" data-data_to_show="par">
                                Participants
                            </div>
                        </div>
                        <span class="badge bg-primary rounded-pill" id="par_badge">_</span>
                    </li>
                </ol>
            </div>
            <div class="col col-12 col-md-10">
                <div class="row mb-3">
                    <div class="col-md-10 ">
                        <h3 id="title_">COURSES</h3>
                    </div>
                    <div class="col-md-2 d-grid gap-2">
                        <button type="button" class="btn btn-primary btn-sm" id="add_btn" data-bs-toggle="modal" data-bs-target="">
                            &#10133 <!-- + sign -->
                        </button>
                    </div>
                </div>

                <table class="table" id="data_table">

                </table>
                <div id="modal_modal">

                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <h3  class="mb-5 mt-5" id="more_info_title_1"></h3>
                    <table class="table" id="more_info_table_1">

                    </table>
                </div>
                <div class="col-sm-12 col-md-6">
                    <h3  class="mb-5 mt-5" id="more_info_title_2"></h3>
                    <table class="table" id="more_info_table_2">

                    </table>
                </div>
            </div>
        </div>
    </main>
    <div id="editing_modal">

    </div>
</div>


<?php include_once __DIR__."/views/partials/footer.php" ?>

