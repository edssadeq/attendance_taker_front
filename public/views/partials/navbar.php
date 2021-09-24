<div class="navbar_">
    <nav class="navbar navbar-expand-lg  navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="#">Attendance lister</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Link</a>
                    </li>

                </ul>
                <?if ($loggedinUserName): ?>
                    <div class="dropdown">
                        <button class="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <?=$loggedinUserName?>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a class="dropdown-item text-danger" href="views/logout.php">Logout</a></li>
                        </ul>
                    </div>
                <?endif;?>

            </div>
        </div>
    </nav>
</div>