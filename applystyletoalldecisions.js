






	var eles = cy.elements('.page');
	for (var i = 0; i < eles.length; i++)
	{	
		openEditPageOverlay(eles[i]);
		//update decision containers
		$('.decisionbutton').each(function(i, ele){
			var preserve_content = $(this).html();
			$(this)[0].outerHTML = project_project.template_menus.decision_template_menu_list["Link"].savedhtml
			$(this).html(preserve_content);
		})
		closeOverlay(eles[i]);
	}