<?PHP

$file = "./src/i18n/en_US/index.json";
$json = file_get_contents($file);
$data = json_decode($json, true);

foreach ($data as $category => $strings) {
	foreach ($strings as $key => $string) {
		$key_string = "$category.$key";
		$command = "grep -r \"$key_string\" src\n";
		$output = shell_exec($command);
		if ($output == "" && $category != 'contract_errors') {
			print "Not used: $key_string\n";
		}
		//print $command . "\n";
		//print "|" . $output . "|\n";
	}
}