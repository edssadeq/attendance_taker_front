<?php
$errors = null;
require_once __DIR__."/../../src/login_src.php";

$page_title = "LOGIN";
$style_file_name = "login";
include_once __DIR__."/partials/header.php"
?>
<div class="login_section">
    <section class="vh-100">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card shadow-2-strong" style="border-radius: 1rem;">
                        <div class="card-body p-5 text-center">

                            <h3 class="mb-5">SING IN</h3>

                            <hr class="my-4">
                            <form action="login.php" method="post">
                                <div class="form-outline mb-2">
                                    <input type="email"  class="form-control " placeholder="Email" name="email" />
                                    <? if ($errors && isset($errors['email'])): ?>
                                        <p class="text-danger"><?= $errors['email']?></p>
                                     <? endif;?>

                                </div>

                                <div class="form-outline mb-2">
                                    <input type="password"  class="form-control " placeholder="password" name="password"/>
                                    <? if ($errors && isset($errors['password'] )): ?>
                                        <p class="text-danger"><?= $errors['password']?></p>
                                    <? endif;?>
                                </div>

                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary  btn-block" type="submit">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
<?php include_once __DIR__."/partials/footer.php" ?>

