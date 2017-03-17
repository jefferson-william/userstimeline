<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Users Timeline</title>
    <script src="<?= $rootStatic ?>/bower_components/requirejs/require.js<?= $extensionStaticFiles ?>"></script>
</head>
<body id="Body" data-root-static="<?= $rootStatic ?>" data-local="<?= $local ?>" data-ec2="<?= $ec2 ?>" ng-cloak>
    <base href="/">
    <div ui-view></div>
    <?= $this->fetch('content') ?>
    <script src="<?= $rootStatic ?>/Bootstrap.js<?= $extensionStaticFiles ?>"></script>
</body>
</html>
