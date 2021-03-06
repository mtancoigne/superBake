<?php

App::uses('AppController', 'Controller');
App::uses('Sbc', 'Sb.Superbake');


class SbAppController extends AppController {

	/**
	 * Sbc object
	 * @var object
	 */
	public $Sbc;

	/**
	 * Statements to execute before doing the action.
	 */
	public function beforeFilter() {
		parent::beforeFilter();

		// Load superBake
		$this->Sbc=new Sbc();
		// Load Sbc config
		$this->Sbc->loadConfig();

		// Check for debug state
		if (Configure::read('debug') === 0) {
			$this->flash(__d('sb', 'superBake isn\'t meant to be used in a production environment. Please disable/remove it if you are done.'), '/admin', 5);
		}

		// Allow all actions.
		if (in_array('Acl', $this->components)) {
			$this->Auth->allow();
		}

		// Search for documentation in Template dir:
		$dir = CakePlugin::path('Sb') . 'Console' . DS . 'Templates' . DS . $this->Sbc->getTemplateName() . DS . 'docs' . DS;
		$docDir = opendir($dir);
		$files = array();
		$menuLinks = array();
		while ($file = readdir($docDir)) {
			if (!is_dir($dir . $file)) {
				$files[] = $file;
			}
		}

		sort($files);

		foreach ($files as $file) {
			$tmp = explode('.', $file);
			//Only use files named something.something.ext and adding entry to the menu
			if (isset($tmp[count($tmp) - 1]) && count($tmp) > 2) {
				// Removing extension
				unset($tmp[count($tmp) - 1]);
				$menuLinks[ucfirst(str_replace('_', ' ', $tmp[0]))][] = array(
						'title' => ucfirst(str_replace('_', ' ', $tmp[1])),
						'file' => $file
				);
			}
		}
		$this->set('templateLinks', $menuLinks);
	}

}
