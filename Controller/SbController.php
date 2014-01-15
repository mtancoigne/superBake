<?php

App::uses('Spyc', 'Sb.Yaml');
App::uses('Sbc', 'Sb.Superbake');
App::uses('Folder', 'Utility');

/**
 * Sb Controller
 *
 * @property Sb $Sb
 */
class SbController extends SbAppController {

	/**
	 * index method
	 *
	 * @return void
	 */
	public function index() {

	}

	/**
	 * This method will load a config file submited in POST.
	 * If nothing is set, it will use the default config file.
	 *
	 * Some vars from Sbc will be available in views.
	 *
	 *
	 * @access private
	 * @return void
	 */
	private function _selectConfigFile() {
		$Sbc = new Sbc();

		if ($this->request->is('post')) {
			$fileToLoad = $this->request->data['configFile'];
		} else {
			$fileToLoad = Configure::read('Sb.defaultConfig');
		}
		// Find the different configuration files
		$configFolder = new Folder($Sbc->getConfigPath());

		// Loads the file
		$Sbc->loadFile($fileToLoad);

		// Giving the array to view
		$this->set('configFiles', $configFolder->find('(.*)\.yml', true));
		$this->set('configFile', $fileToLoad);
		$this->set('configFileDescription', $Sbc->getConfig('description'));
		$this->set('log', $Sbc->displayLog());
		$this->set('logErrors', $Sbc->getErrors());
		$this->set('logWarnings', $Sbc->getWarnings());

		return $Sbc;
	}

	/**
	 * This action will display the final configuration file, after population.
	 * In addition, the view displays the logs from Sbc::populate() to check for errors.
	 *
	 * @return void
	 */
	public function check() {
		$Sbc = $this->_selectConfigFile();
		$this->set('completeConfig', Spyc::YAMLDump($Sbc->getConfig()));
	}

	/**
	 * Displays the configuration file in a more readable way.
	 * (Named 'tree' because the very first version was a tree-like render)
	 *
	 * @return void
	 */
	public function tree() {
		$Sbc = $this->_selectConfigFile();
		// Prefixes and actions list:
		$defaults_prefixes_list = '';
		foreach ($Sbc->getConfig('defaults.actions') as $prefix => $action) {
			$defaults_prefixes_list.=$prefix . ', ';
		}
		$this->set('defaults_prefixes_list', rtrim($defaults_prefixes_list, ', '));
		$this->set('completeConfig', $Sbc->getConfig());
	}

	/**
	 * Method to test the Sbc::arrayMerge() method.
	 * Here for testing only.
	 *
	 * @return void
	 */
	public function arraymerge() {
		$result = '';
		if ($this->request->is('post')) {
			$Sbc = new Sbc();
			$spyc = new Spyc();
			$default = $this->request->data['default'];
			$defined = $this->request->data['defined'];
			$keep = (isset($this->request->data['keepRest']) && $this->request->data['keepRest'] === 'keep') ? true : false;
			$result = $spyc->YAMLDump($Sbc->updateArray($spyc->YAMLLoadString($default), $spyc->YAMLLoadString($defined), $keep));
		} else {
			$default = null;
			$defined = null;
			$keep = null;
			$result = null;
		}
		$this->set('result', $result);
		$this->set('default', $default);
		$this->set('defined', $defined);
		$this->set('keepRest', $keep);
	}

}
