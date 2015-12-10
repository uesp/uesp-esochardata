var ecdLastTooltip = null;

function onTooltipHoverShow()
{
	ecdLastTooltip = $(this).find('.ecdTooltip');
	if (ecdLastTooltip) ecdLastTooltip.css('display', 'inline-block');
}


function onTooltipHoverHide()
{
	if (ecdLastTooltip) ecdLastTooltip.hide();
}


function onTooltipMouseMove(e)
{
	if (ecdLastTooltip == null) return;
	
    var mousex = e.pageX + 20;
    var mousey = e.pageY + 20 
    
    var tipWidth  = ecdLastTooltip.width();
    var tipHeight = ecdLastTooltip.height();

    var tipVisX = $(window).width() - (mousex + tipWidth);
    var tipVisY = $(window).height() - (mousey + tipHeight);

    if ( tipVisX < 20 ) {
        mousex = e.pageX - tipWidth - 20;
    } if ( tipVisY < 20 ) {
        mousey = e.pageY - tipHeight - 20;
    }
    
    ecdLastTooltip.css({  top: mousey, left: mousex });
}


function onDocReady() 
{  
	$(".ecdTooltipTrigger").hover(onTooltipHoverShow, onTooltipHoverHide, onTooltipMouseMove);
	$(".ecdTooltip").hover(onTooltipHoverHide, onTooltipHoverHide, onTooltipHoverHide);
	
	$('.eso_item_link').hover(OnEsoItemLinkEnter, OnEsoItemLinkLeave);
	
	$('.ecdSkillTreeName1').click(OnEsoSkillTreeName1Click);
	$('.ecdSkillTreeName2').click(OnEsoSkillTreeName2Click);
	
	EsoSkillTree_LastOpenTreeName = $('.ecdSkillTreeName1:visible').first();
	EsoSkillTree_LastOpenTree = $('.ecdSkillTreeContent1:visible').first();
	
	EsoSkillTree_LastSkillContentName = $('.ecdSkillTreeNameHighlight2').first();
	EsoSkillTree_LastSkillContent = $('.ecdSkillData:visible').first();
}


var EsoSkillTree_LastOpenTree = null;
var EsoSkillTree_LastOpenTreeName = null;
var EsoSkillTree_LastSkillContentName = null;
var EsoSkillTree_LastSkillContent = null;


function OnEsoSkillTreeName1Click(e)
{
	
	if (EsoSkillTree_LastOpenTree != null)
	{
		if (EsoSkillTree_LastOpenTree.is($(this).next(".ecdSkillTreeContent1"))) return;
		EsoSkillTree_LastOpenTree.slideUp();
		EsoSkillTree_LastOpenTreeName.removeClass('ecdSkillTreeNameHighlight');
		EsoSkillTree_LastOpenTree = null;
		EsoSkillTree_LastOpenTreeName = null;
	}
	
	EsoSkillTree_LastOpenTreeName = $(this);
	EsoSkillTree_LastOpenTree = EsoSkillTree_LastOpenTreeName.next(".ecdSkillTreeContent1");
	
	EsoSkillTree_LastOpenTreeName.addClass('ecdSkillTreeNameHighlight');
	EsoSkillTree_LastOpenTree.slideDown();

	SelectEsoSkillTreeContents(EsoSkillTree_LastOpenTree.children(".ecdSkillTreeName2").first());
}


function OnEsoSkillTreeName2Click(e)
{
	SelectEsoSkillTreeContents($(this));
}


function SelectEsoSkillTreeContents(object)
{
	if (EsoSkillTree_LastSkillContentName != null)
	{
		EsoSkillTree_LastSkillContentName.removeClass('ecdSkillTreeNameHighlight2');
		EsoSkillTree_LastSkillContentName = null;
	}
	
	if (EsoSkillTree_LastSkillContent != null)
	{
		EsoSkillTree_LastSkillContent.hide();
		EsoSkillTree_LastSkillContent = null;
		$('#ecdSkillContentTitle').text('');
	}
	
	EsoSkillTree_LastSkillContentName = object;
	object.addClass('ecdSkillTreeNameHighlight2');
	
	var objText = object.contents().filter(function(){ return this.nodeType == 3;})[0].nodeValue;
	
	$('#ecdSkillContentTitle').text(object.text());
	
	var idName = 'ecdSkill_' + objText.replace(" ", "").replace("'", "");
	EsoSkillTree_LastSkillContent = $('#'+idName); 
	EsoSkillTree_LastSkillContent.show(); 
}


$(document).ready(onDocReady);
