using UnityEngine;
using NotebookWar.Input;

namespace NotebookWar.Player
{
    public class PlayerMovementExtended : MonoBehaviour
    {
        [Header("Slide Settings")]
        [SerializeField] private float slideSpeed = 8f;
        [SerializeField] private float slideDuration = 1f;
        [SerializeField] private float slideHeight = 0.5f;
        
        [Header("Vault Settings")]
        [SerializeField] private float vaultHeight = 2f;
        [SerializeField] private float vaultDistance = 1.5f;
        [SerializeField] private LayerMask vaultLayers;
        
        [Header("Interaction")]
        [SerializeField] private float interactionRange = 3f;
        [SerializeField] private LayerMask interactionLayers;
        
        private CharacterController controller;
        private IInputProvider input;
        private PlayerController playerController;
        
        private bool isSliding = false;
        private float slideTimer = 0f;
        private Vector3 slideDirection;

        private void Awake()
        {
            controller = GetComponent<CharacterController>();
            playerController = GetComponent<PlayerController>();
            input = new KeyboardMouseInput();
        }

        private void Update()
        {
            HandleSlide();
            HandleVault();
            HandleInteraction();
        }

        private void HandleSlide()
        {
            if (input.GetCrouchInput() && input.GetSprintInput() && !isSliding)
            {
                StartSlide();
            }

            if (isSliding)
            {
                slideTimer += Time.deltaTime;
                
                Vector3 slideMovement = slideDirection * slideSpeed * Time.deltaTime;
                controller.Move(slideMovement);
                
                if (slideTimer >= slideDuration)
                {
                    EndSlide();
                }
            }
        }

        private void StartSlide()
        {
            isSliding = true;
            slideTimer = 0f;
            slideDirection = transform.forward;
            
            // Lower player height
            controller.height = slideHeight;
            controller.center = new Vector3(0, slideHeight / 2, 0);
        }

        private void EndSlide()
        {
            isSliding = false;
            
            // Restore player height
            controller.height = 2f;
            controller.center = new Vector3(0, 1f, 0);
        }

        private void HandleVault()
        {
            if (input.GetJumpInput())
            {
                Vector3 vaultCheck = transform.position + transform.forward * vaultDistance;
                
                if (Physics.Raycast(vaultCheck, Vector3.down, out RaycastHit hit, vaultHeight, vaultLayers))
                {
                    if (hit.point.y > transform.position.y + 0.5f && hit.point.y < transform.position.y + vaultHeight)
                    {
                        PerformVault(hit.point);
                    }
                }
            }
        }

        private void PerformVault(Vector3 vaultPoint)
        {
            Vector3 vaultTarget = vaultPoint + transform.forward * 1f;
            vaultTarget.y = vaultPoint.y + 0.1f;
            
            StartCoroutine(VaultCoroutine(vaultTarget));
        }

        private System.Collections.IEnumerator VaultCoroutine(Vector3 target)
        {
            Vector3 startPos = transform.position;
            float vaultTime = 0.5f;
            float elapsed = 0f;
            
            while (elapsed < vaultTime)
            {
                elapsed += Time.deltaTime;
                float progress = elapsed / vaultTime;
                
                Vector3 currentPos = Vector3.Lerp(startPos, target, progress);
                currentPos.y += Mathf.Sin(progress * Mathf.PI) * 1f; // Arc motion
                
                controller.Move(currentPos - transform.position);
                yield return null;
            }
        }

        private void HandleInteraction()
        {
            if (input.GetInteractInput())
            {
                Ray ray = Camera.main.ScreenPointToRay(new Vector3(Screen.width / 2, Screen.height / 2));
                
                if (Physics.Raycast(ray, out RaycastHit hit, interactionRange, interactionLayers))
                {
                    IInteractable interactable = hit.collider.GetComponent<IInteractable>();
                    if (interactable != null)
                    {
                        interactable.Interact();
                    }
                }
            }
        }

        public bool IsSliding() => isSliding;
    }

    public interface IInteractable
    {
        void Interact();
    }
}